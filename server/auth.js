import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

const cookieName = "pfa_session";

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== "production") return "dev-secret-change-me-dev-secret-change-me";
  throw new Error("Missing AUTH_SECRET (min 32 chars)");
}

export function issueSessionCookie(res, user) {
  const token = jwt.sign(
    { sub: user.id, role: user.role, username: user.username },
    getAuthSecret(),
    { expiresIn: "7d" }
  );

  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(cookieName, { path: "/" });
}

export function readSession(req) {
  const token = req.cookies?.[cookieName];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, getAuthSecret());
    if (!payload || typeof payload !== "object") return null;
    return {
      id: payload.sub,
      role: payload.role,
      username: payload.username,
    };
  } catch {
    return null;
  }
}

async function readSupabaseSession(req) {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const auth = req.headers?.authorization ? String(req.headers.authorization) : "";
  if (!auth.toLowerCase().startsWith("bearer ")) return null;
  const token = auth.slice(7).trim();
  if (!token) return null;

  const res = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => null);
  if (!res || !res.ok) return null;
  const user = await res.json().catch(() => null);
  if (!user || typeof user !== "object") return null;

  const allow = String(process.env.SUPABASE_ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const email = typeof user.email === "string" ? user.email : "";
  if (allow.length && !allow.includes(email.toLowerCase())) return null;

  return {
    id: user.id,
    role: "admin",
    username: email || "supabase_admin",
  };
}

export async function requireAdmin(req, res, next) {
  const session = readSession(req);
  if (session && session.role === "admin") {
    req.user = session;
    next();
    return;
  }

  const sb = await readSupabaseSession(req);
  if (sb) {
    req.user = sb;
    next();
    return;
  }

  res.status(401).json({ error: "unauthorized" });
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function createId(prefix) {
  return `${prefix}_${nanoid(12)}`;
}
