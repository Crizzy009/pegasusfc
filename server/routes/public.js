import express from "express";
import { validateContent } from "../contentSchemas.js";
import { createId } from "../auth.js";
import { writeAudit } from "../audit.js";
import { listPlayers } from "../supabaseRest.js";

function isExpiredTrial(data) {
  const now = Date.now();
  if (data.expiresAtIso) {
    const t = Date.parse(data.expiresAtIso);
    if (!Number.isNaN(t) && t < now) return true;
  }
  if (data.isoDate) {
    const d = Date.parse(data.isoDate);
    if (!Number.isNaN(d) && d + 24 * 60 * 60 * 1000 < now) return true;
  }
  return false;
}

function isScheduledInFuture(data) {
  const now = Date.now();
  if (data.scheduledAt) {
    const t = Date.parse(data.scheduledAt);
    if (!Number.isNaN(t) && t > now) return true;
  }
  return false;
}

export function createPublicRouter({ db }) {
  const router = express.Router();

  function insertPublicContent({ type, data, ip, res, next }) {
    try {
      const now = Date.now();
      const payload = {
        ...data,
        createdAtIso: new Date(now).toISOString(),
      };
      const validated = validateContent(type, payload);
      const id = createId(type);

      db.prepare(
        `INSERT INTO content (id, type, status, data_json, created_at, updated_at)
         VALUES (@id, @type, @status, @data_json, @created_at, @updated_at)`
      ).run({
        id,
        type,
        status: "published",
        data_json: JSON.stringify(validated),
        created_at: now,
        updated_at: now,
      });

      writeAudit(db, {
        userId: null,
        action: "public_create",
        entityType: type,
        entityId: id,
        beforeJson: null,
        afterJson: JSON.stringify(validated),
        ip,
      });

      res.status(201).json({ id });
    } catch (e) {
      next(e);
    }
  }

  router.get("/content", (req, res) => {
    const type = req.query.type ? String(req.query.type) : null;
    if (!type) {
      res.status(400).json({ error: "missing_type" });
      return;
    }

    const rows = db
      .prepare(
        `SELECT id, type, status, data_json, created_at, updated_at
         FROM content
         WHERE type = ? AND status = 'published'
         ORDER BY updated_at DESC`
      )
      .all(type);

    const items = rows
      .map((r) => ({
        id: r.id,
        type: r.type,
        data: JSON.parse(r.data_json),
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }))
      .filter((item) => {
        if (item.type === "trial") return !isExpiredTrial(item.data);
        if (item.type === "newsPost") return !isScheduledInFuture(item.data);
        return true;
      })
      .sort((a, b) => {
        const ao = Number(a.data?.order ?? 0);
        const bo = Number(b.data?.order ?? 0);
        if (ao !== bo) return ao - bo;
        return b.updatedAt - a.updatedAt;
      });

    res.json({ items });
  });

  router.post("/registrations", (req, res, next) => {
    const data = req.body?.data ?? null;
    if (!data) {
      res.status(400).json({ error: "invalid_request" });
      return;
    }
    insertPublicContent({ type: "registration", data: { ...data, status: "new" }, ip: req.ip, res, next });
  });

  router.post("/trial-bookings", (req, res, next) => {
    const data = req.body?.data ?? null;
    if (!data) {
      res.status(400).json({ error: "invalid_request" });
      return;
    }
    insertPublicContent({ type: "trialBooking", data: { ...data, status: "new" }, ip: req.ip, res, next });
  });

  router.post("/contact-messages", (req, res, next) => {
    const data = req.body?.data ?? null;
    if (!data) {
      res.status(400).json({ error: "invalid_request" });
      return;
    }
    insertPublicContent({ type: "contactMessage", data: { ...data, status: "new" }, ip: req.ip, res, next });
  });

  router.get("/players", async (_req, res, next) => {
    try {
      const rows = await listPlayers();
      const items = (Array.isArray(rows) ? rows : []).map((r) => ({
        id: r.id,
        type: "player",
        data: r.data_json,
        createdAt: Number(r.created_at ?? 0),
        updatedAt: Number(r.updated_at ?? 0),
      }));
      res.json({ items });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
