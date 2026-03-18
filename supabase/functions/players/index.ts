import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type PlayerRow = {
  id: string;
  data_json: unknown;
  created_at: number;
  updated_at: number;
};

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...(init?.headers || {}),
    },
  });
}

function supabaseEnv() {
  const url =
    Deno.env.get("SUPABASE_URL") ??
    Deno.env.get("URL") ??
    Deno.env.get("SUPABASE_PROJECT_URL") ??
    "";
  const anonKey =
    Deno.env.get("SUPABASE_ANON_KEY") ??
    Deno.env.get("ANON_KEY") ??
    Deno.env.get("SUPABASE_KEY") ??
    "";
  const serviceKey =
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    Deno.env.get("SERVICE_ROLE_KEY") ??
    "";
  const adminEmails = (
    Deno.env.get("SUPABASE_ADMIN_EMAILS") ??
    Deno.env.get("ADMIN_EMAILS") ??
    ""
  )
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (!url || !anonKey) throw new Error("supabase_not_configured");
  return { url, anonKey, serviceKey, adminEmails };
}

async function requireAdmin(req: Request) {
  const { url, anonKey, adminEmails } = supabaseEnv();
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  if (!token) throw new Error("missing_token");

  const client = createClient(url, anonKey);
  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user) throw new Error("invalid_token");

  const email = (data.user.email ?? "").toLowerCase();
  if (!email) throw new Error("invalid_token");
  if (adminEmails.length && !adminEmails.includes(email)) throw new Error("not_admin");
  return { email };
}

function clientAdminFlag(req: Request) {
  return (req.headers.get("x-admin") ?? "") === "1";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { url, serviceKey } = supabaseEnv();
    const service = serviceKey ? createClient(url, serviceKey) : null;
    const u = new URL(req.url);
    const parts = u.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] ?? "";
    const id = last.startsWith("player_") ? last : null;

    if (req.method === "GET") {
      if (!service) return json({ error: "supabase_not_configured" }, { status: 500 });
      const { data, error } = await service
        .from("players")
        .select("id,data_json,created_at,updated_at")
        .order("updated_at", { ascending: false });
      if (error) return json({ error: error.message }, { status: 500 });
      const items = (data ?? []).map((r: PlayerRow) => ({
        id: r.id,
        type: "player",
        data: r.data_json,
        createdAt: Number(r.created_at ?? 0),
        updatedAt: Number(r.updated_at ?? 0),
      }));
      return json({ items });
    }

    if (!clientAdminFlag(req)) return json({ error: "missing_admin_header" }, { status: 401 });
    await requireAdmin(req);
    if (!service) return json({ error: "supabase_not_configured" }, { status: 500 });

    if (req.method === "POST") {
      const body = await req.json().catch(() => null) as any;
      const data = body?.data ?? null;
      if (!data) return json({ error: "invalid_request" }, { status: 400 });
      const now = Date.now();
      if (Array.isArray(data)) {
        const rows = data.map((d) => ({
          id: `player_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`,
          data_json: d,
          created_at: now,
          updated_at: now,
        }));
        const { error } = await service.from("players").insert(rows);
        if (error) return json({ error: error.message }, { status: 500 });
        return json({ inserted: rows.length, ids: rows.map((r) => r.id) }, { status: 201 });
      }

      const newId = `player_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`;
      const { error } = await service.from("players").insert({
        id: newId,
        data_json: data,
        created_at: now,
        updated_at: now,
      });
      if (error) return json({ error: error.message }, { status: 500 });
      return json({ inserted: 1, ids: [newId] }, { status: 201 });
    }

    if (req.method === "PUT") {
      if (!id) return json({ error: "invalid_request" }, { status: 400 });
      const body = await req.json().catch(() => null) as any;
      const data = body?.data ?? null;
      if (!data) return json({ error: "invalid_request" }, { status: 400 });
      const now = Date.now();
      const { error } = await service.from("players").update({ data_json: data, updated_at: now }).eq("id", id);
      if (error) return json({ error: error.message }, { status: 500 });
      return json({ ok: true });
    }

    if (req.method === "DELETE") {
      if (!id) return json({ error: "invalid_request" }, { status: 400 });
      const { error } = await service.from("players").delete().eq("id", id);
      if (error) return json({ error: error.message }, { status: 500 });
      return json({ ok: true });
    }

    return json({ error: "method_not_allowed" }, { status: 405 });
  } catch (e: any) {
    const msg = String(e?.message ?? "server_error");
    const status =
      msg === "missing_token" || msg === "invalid_token" || msg === "not_admin" || msg === "missing_admin_header"
        ? 401
        : msg === "invalid_request"
          ? 400
          : 500;
    return json({ error: msg }, { status });
  }
});
