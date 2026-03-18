import express from "express";
import { issueSessionCookie, clearSessionCookie, verifyPassword } from "../auth.js";

export function createAuthRouter({ db }) {
  const router = express.Router();

  router.get("/me", (req, res) => {
    res.json({ user: req.user ?? null });
  });

  router.post("/login", async (req, res, next) => {
    try {
      const username = String(req.body?.username ?? "").trim();
      const password = String(req.body?.password ?? "");

      if (!username || !password) {
        res.status(400).json({ error: "missing_credentials" });
        return;
      }

      const row = db
        .prepare("SELECT id, username, password_hash, role FROM users WHERE username = ?")
        .get(username);

      if (!row) {
        res.status(401).json({ error: "invalid_credentials" });
        return;
      }

      const ok = await verifyPassword(password, row.password_hash);
      if (!ok) {
        res.status(401).json({ error: "invalid_credentials" });
        return;
      }

      issueSessionCookie(res, { id: row.id, username: row.username, role: row.role });
      res.json({ ok: true, user: { id: row.id, username: row.username, role: row.role } });
    } catch (e) {
      next(e);
    }
  });

  router.post("/logout", (req, res) => {
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  return router;
}
