import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { validateContent, listContentTypes } from "../contentSchemas.js";
import { createId } from "../auth.js";
import { writeAudit } from "../audit.js";
import { deletePlayer, insertPlayer, listPlayers, updatePlayer } from "../supabaseRest.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

function uploadsDir() {
  return path.resolve(process.cwd(), "server-data", "uploads");
}

function ensureUploadsDir() {
  const dir = uploadsDir();
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function publicUploadUrl(fileName) {
  return `/uploads/${encodeURIComponent(fileName)}`;
}

export function createAdminRouter({ db }) {
  const router = express.Router();

  router.get("/types", (_req, res) => {
    res.json({ types: listContentTypes() });
  });

  router.get("/content", (req, res) => {
    const type = req.query.type ? String(req.query.type) : null;
    const status = req.query.status ? String(req.query.status) : null;
    const q = req.query.q ? String(req.query.q).trim() : "";
    const limit = Math.max(1, Math.min(200, Number(req.query.limit ?? 100)));
    const offset = Math.max(0, Number(req.query.offset ?? 0));

    const where = [];
    const params = {};

    if (type) {
      where.push("type = @type");
      params.type = type;
    }
    if (status) {
      where.push("status = @status");
      params.status = status;
    }
    if (q) {
      where.push("data_json LIKE @q");
      params.q = `%${q.replace(/%/g, "\\%").replace(/_/g, "\\_")}%`;
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const rows = db
      .prepare(
        `SELECT id, type, status, data_json, created_at, updated_at
         FROM content
         ${whereSql}
         ORDER BY updated_at DESC
         LIMIT @limit OFFSET @offset`
      )
      .all({ ...params, limit, offset });

    const items = rows.map((r) => ({
      id: r.id,
      type: r.type,
      status: r.status,
      data: JSON.parse(r.data_json),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    res.json({ items, limit, offset });
  });

  router.post("/content", (req, res, next) => {
    try {
      const type = String(req.body?.type ?? "");
      const status = String(req.body?.status ?? "draft");
      const data = req.body?.data ?? null;
      const now = Date.now();

      if (!type || !data) {
        res.status(400).json({ error: "invalid_request" });
        return;
      }
      if (!["draft", "published"].includes(status)) {
        res.status(400).json({ error: "invalid_status" });
        return;
      }

      const validated = validateContent(type, data);
      const id = createId(type);

      db.prepare(
        `INSERT INTO content (id, type, status, data_json, created_at, updated_at)
         VALUES (@id, @type, @status, @data_json, @created_at, @updated_at)`
      ).run({
        id,
        type,
        status,
        data_json: JSON.stringify(validated),
        created_at: now,
        updated_at: now,
      });

      writeAudit(db, {
        userId: req.user?.id,
        action: "create",
        entityType: "content",
        entityId: id,
        beforeJson: null,
        afterJson: JSON.stringify({ type, status, data: validated }),
        ip: req.ip,
      });

      res.status(201).json({ id });
    } catch (e) {
      next(e);
    }
  });

  router.put("/content/:id", (req, res, next) => {
    try {
      const id = String(req.params.id);
      const existing = db
        .prepare("SELECT id, type, status, data_json FROM content WHERE id = ?")
        .get(id);

      if (!existing) {
        res.status(404).json({ error: "not_found" });
        return;
      }

      const status = req.body?.status ? String(req.body.status) : existing.status;
      const data = req.body?.data ?? JSON.parse(existing.data_json);
      const validated = validateContent(existing.type, data);
      const now = Date.now();

      db.prepare(
        `UPDATE content
         SET status = @status, data_json = @data_json, updated_at = @updated_at
         WHERE id = @id`
      ).run({
        id,
        status,
        data_json: JSON.stringify(validated),
        updated_at: now,
      });

      writeAudit(db, {
        userId: req.user?.id,
        action: "update",
        entityType: "content",
        entityId: id,
        beforeJson: existing.data_json,
        afterJson: JSON.stringify(validated),
        ip: req.ip,
      });

      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  router.delete("/content/:id", (req, res) => {
    const id = String(req.params.id);
    const existing = db
      .prepare("SELECT id, type, status, data_json FROM content WHERE id = ?")
      .get(id);
    if (!existing) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    db.prepare("DELETE FROM content WHERE id = ?").run(id);

    writeAudit(db, {
      userId: req.user?.id,
      action: "delete",
      entityType: "content",
      entityId: id,
      beforeJson: existing.data_json,
      afterJson: null,
      ip: req.ip,
    });

    res.json({ ok: true });
  });

  router.post("/content/bulk", (req, res) => {
    const action = String(req.body?.action ?? "");
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(String) : [];
    const allowed = ["publish", "unpublish", "delete"];
    if (!allowed.includes(action) || ids.length === 0) {
      res.status(400).json({ error: "invalid_request" });
      return;
    }

    const tx = db.transaction(() => {
      for (const id of ids) {
        const existing = db
          .prepare("SELECT id, data_json FROM content WHERE id = ?")
          .get(id);
        if (!existing) continue;

        if (action === "delete") {
          db.prepare("DELETE FROM content WHERE id = ?").run(id);
          writeAudit(db, {
            userId: req.user?.id,
            action: "delete",
            entityType: "content",
            entityId: id,
            beforeJson: existing.data_json,
            afterJson: null,
            ip: req.ip,
          });
          continue;
        }

        const status = action === "publish" ? "published" : "draft";
        db.prepare("UPDATE content SET status = ?, updated_at = ? WHERE id = ?").run(
          status,
          Date.now(),
          id
        );
        writeAudit(db, {
          userId: req.user?.id,
          action: "update",
          entityType: "content",
          entityId: id,
          beforeJson: existing.data_json,
          afterJson: existing.data_json,
          ip: req.ip,
        });
      }
    });

    tx();
    res.json({ ok: true });
  });

  router.get("/players", async (_req, res, next) => {
    try {
      const rows = await listPlayers();
      const items = (Array.isArray(rows) ? rows : []).map((r) => ({
        id: r.id,
        type: "player",
        status: "published",
        data: r.data_json,
        createdAt: Number(r.created_at ?? 0),
        updatedAt: Number(r.updated_at ?? 0),
      }));
      res.json({ items });
    } catch (e) {
      next(e);
    }
  });

  router.post("/players", async (req, res, next) => {
    try {
      const data = req.body?.data ?? null;
      if (!data) {
        res.status(400).json({ error: "invalid_request" });
        return;
      }
      const now = Date.now();
      const validated = validateContent("player", data);
      const id = createId("player");
      await insertPlayer({ id, data_json: validated, created_at: now, updated_at: now });
      writeAudit(db, {
        userId: req.user?.id,
        action: "create",
        entityType: "player",
        entityId: id,
        beforeJson: null,
        afterJson: JSON.stringify(validated),
        ip: req.ip,
      });
      res.status(201).json({ id });
    } catch (e) {
      next(e);
    }
  });

  router.put("/players/:id", async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const data = req.body?.data ?? null;
      if (!data) {
        res.status(400).json({ error: "invalid_request" });
        return;
      }
      const validated = validateContent("player", data);
      const now = Date.now();
      await updatePlayer(id, { data_json: validated, updated_at: now });
      writeAudit(db, {
        userId: req.user?.id,
        action: "update",
        entityType: "player",
        entityId: id,
        beforeJson: null,
        afterJson: JSON.stringify(validated),
        ip: req.ip,
      });
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  router.delete("/players/:id", async (req, res, next) => {
    try {
      const id = String(req.params.id);
      await deletePlayer(id);
      writeAudit(db, {
        userId: req.user?.id,
        action: "delete",
        entityType: "player",
        entityId: id,
        beforeJson: null,
        afterJson: null,
        ip: req.ip,
      });
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  router.post("/upload", upload.single("file"), async (req, res, next) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "missing_file" });
        return;
      }

      const mime = file.mimetype;
      const isImage = ["image/jpeg", "image/png", "image/webp"].includes(mime);
      if (!isImage) {
        res.status(400).json({ error: "unsupported_file_type" });
        return;
      }

      ensureUploadsDir();
      const base = createId("img");

      const originalName = `${base}.webp`;
      const largeName = `${base}_lg.webp`;
      const mediumName = `${base}_md.webp`;
      const thumbName = `${base}_th.webp`;

      const originalPath = path.join(uploadsDir(), originalName);
      const largePath = path.join(uploadsDir(), largeName);
      const mediumPath = path.join(uploadsDir(), mediumName);
      const thumbPath = path.join(uploadsDir(), thumbName);

      const pipeline = sharp(file.buffer).rotate();

      await pipeline.clone().webp({ quality: 85 }).toFile(originalPath);
      await pipeline.clone().resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(largePath);
      await pipeline.clone().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(mediumPath);
      await pipeline.clone().resize({ width: 400, withoutEnlargement: true }).webp({ quality: 75 }).toFile(thumbPath);

      res.json({
        image: {
          originalUrl: publicUploadUrl(originalName),
          largeUrl: publicUploadUrl(largeName),
          mediumUrl: publicUploadUrl(mediumName),
          thumbUrl: publicUploadUrl(thumbName),
        },
      });
    } catch (e) {
      next(e);
    }
  });

  router.get("/audit", (req, res) => {
    const limit = Math.max(1, Math.min(200, Number(req.query.limit ?? 100)));
    const offset = Math.max(0, Number(req.query.offset ?? 0));

    const rows = db
      .prepare(
        `SELECT id, user_id, action, entity_type, entity_id, before_json, after_json, ip, created_at
         FROM audit_log
         ORDER BY created_at DESC
         LIMIT @limit OFFSET @offset`
      )
      .all({ limit, offset });

    res.json({ items: rows, limit, offset });
  });

  router.get("/backup", (_req, res) => {
    const rows = db
      .prepare("SELECT id, type, status, data_json, created_at, updated_at FROM content")
      .all();
    res.json({
      version: 1,
      exportedAt: new Date().toISOString(),
      content: rows.map((r) => ({
        id: r.id,
        type: r.type,
        status: r.status,
        data: JSON.parse(r.data_json),
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })),
    });
  });

  router.post("/restore", (req, res) => {
    const payload = req.body;
    const content = Array.isArray(payload?.content) ? payload.content : null;
    if (!content) {
      res.status(400).json({ error: "invalid_backup" });
      return;
    }

    const tx = db.transaction(() => {
      db.prepare("DELETE FROM content").run();
      const now = Date.now();
      for (const item of content) {
        const type = String(item.type ?? "");
        const id = String(item.id ?? createId(type));
        const status = String(item.status ?? "draft");
        const data = validateContent(type, item.data ?? {});
        db.prepare(
          `INSERT INTO content (id, type, status, data_json, created_at, updated_at)
           VALUES (@id, @type, @status, @data_json, @created_at, @updated_at)`
        ).run({
          id,
          type,
          status,
          data_json: JSON.stringify(data),
          created_at: Number(item.createdAt ?? now),
          updated_at: Number(item.updatedAt ?? now),
        });
      }
    });

    tx();

    writeAudit(db, {
      userId: req.user?.id,
      action: "restore",
      entityType: "backup",
      entityId: null,
      beforeJson: null,
      afterJson: JSON.stringify({ count: content.length }),
      ip: req.ip,
    });

    res.json({ ok: true });
  });

  return router;
}
