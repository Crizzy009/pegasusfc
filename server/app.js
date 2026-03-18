import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import { getDb } from "./db.js";
import { createAuthRouter } from "./routes/auth.js";
import { createAdminRouter } from "./routes/admin.js";
import { createPublicRouter } from "./routes/public.js";
import { readSession, requireAdmin, createId, hashPassword } from "./auth.js";
import { ensureSeedData } from "./seed.js";

export async function createApp() {
  const db = getDb();
  await ensureAdminUser(db);
  ensureSeedData(db);

  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());

  const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
  app.use(
    cors({
      origin,
      credentials: true,
    })
  );

  app.use((req, _res, next) => {
    req.user = readSession(req);
    next();
  });

  const uploadsPath = path.resolve(process.cwd(), "server-data", "uploads");
  fs.mkdirSync(uploadsPath, { recursive: true });
  app.use("/uploads", express.static(uploadsPath, { maxAge: "7d", immutable: true }));

  app.use("/api/auth", createAuthRouter({ db }));
  app.use("/api/admin", requireAdmin, createAdminRouter({ db }));
  app.use("/api/public", createPublicRouter({ db }));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.use((err, _req, res, _next) => {
    const status = Number(err?.statusCode ?? err?.status ?? 500);
    const message = typeof err?.message === "string" ? err.message : "server_error";
    res.status(status).json({ error: message });
  });

  return app;
}

async function ensureAdminUser(db) {
  const c = db.prepare("SELECT COUNT(*) as c FROM users").get().c;
  if (c > 0) return;

  const username = (process.env.ADMIN_USERNAME || "admin").trim();
  const password =
    process.env.ADMIN_INITIAL_PASSWORD ||
    (process.env.NODE_ENV !== "production" ? "admin12345" : "");

  if (!password || password.length < 10) {
    throw new Error(
      "Admin user missing. Set ADMIN_INITIAL_PASSWORD (min 10 chars) before starting the server."
    );
  }

  const now = Date.now();
  const hash = await hashPassword(password);
  db.prepare(
    `INSERT INTO users (id, username, password_hash, role, created_at)
     VALUES (@id, @username, @password_hash, @role, @created_at)`
  ).run({
    id: createId("user"),
    username,
    password_hash: hash,
    role: "admin",
    created_at: now,
  });
}
