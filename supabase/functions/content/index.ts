import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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
  const editorEmails = (
    Deno.env.get("SUPABASE_EDITOR_EMAILS") ??
    Deno.env.get("EDITOR_EMAILS") ??
    ""
  )
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (!url || !anonKey) throw new Error("supabase_not_configured");
  return { url, anonKey, serviceKey, adminEmails, editorEmails };
}

function clientAdminFlag(req: Request) {
  return (req.headers.get("x-admin") ?? "") === "1";
}

async function requireAdmin(req: Request) {
  const { url, anonKey, adminEmails, editorEmails } = supabaseEnv();
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  if (!token) throw new Error("missing_token");

  const client = createClient(url, anonKey);
  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user) throw new Error("invalid_token");

  const email = (data.user.email ?? "").toLowerCase();
  if (!email) throw new Error("invalid_token");
  if (!adminEmails.length && !editorEmails.length) return { email, role: "admin" as const };
  if (adminEmails.includes(email)) return { email, role: "admin" as const };
  if (editorEmails.includes(email)) return { email, role: "editor" as const };
  throw new Error("not_admin");
}

function createId(type: string) {
  const id = crypto.randomUUID().replaceAll("-", "").slice(0, 12);
  return `${type}_${id}`;
}

function parseUrl(req: Request) {
  const url = new URL(req.url);
  let path = url.pathname;
  const prefixes = ["/functions/v1/content", "/content"];
  for (const p of prefixes) {
    if (path === p) {
      path = "";
      break;
    }
    if (path.startsWith(`${p}/`)) {
      path = path.slice(p.length + 1);
      break;
    }
  }
  path = path.replace(/^\/+/, "");
  const parts = path.split("/").filter(Boolean);
  return { url, parts };
}

type ContentRow = {
  id: string;
  type: string;
  status: string;
  data: unknown;
  created_at: number;
  updated_at: number;
};

function toItem(r: any) {
  return {
    id: String(r.id),
    type: String(r.type),
    status: String(r.status),
    data: r.data,
    createdAt: Number(r.created_at ?? 0),
    updatedAt: Number(r.updated_at ?? 0),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { parts, url: parsed } = parseUrl(req);
    const isAdmin = clientAdminFlag(req);

    const { url, serviceKey } = supabaseEnv();
    if (!serviceKey) return json({ error: "supabase_not_configured" }, { status: 500 });
    const service = createClient(url, serviceKey);

    if (req.method === "GET") {
      const type = parsed.searchParams.get("type");
      const status = parsed.searchParams.get("status");
      const q = (parsed.searchParams.get("q") ?? "").trim();
      const limit = Math.max(1, Math.min(200, Number(parsed.searchParams.get("limit") ?? 100)));
      const offset = Math.max(0, Number(parsed.searchParams.get("offset") ?? 0));

      if (isAdmin) await requireAdmin(req);

      let query = service
        .from("content")
        .select("id,type,status,data,created_at,updated_at")
        .order("updated_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (type) query = query.eq("type", type);
      if (status) query = query.eq("status", status);
      if (!isAdmin) query = query.eq("status", "published");
      void q;

      const { data, error } = await query;
      if (error) {
        const msg = String(error.message ?? "");
        if (msg.toLowerCase().includes("relation") && msg.toLowerCase().includes("content")) {
          return json({ error: "missing_content_table" }, { status: 500 });
        }
        return json({ error: msg || "server_error" }, { status: 500 });
      }
      const items = (Array.isArray(data) ? data : []).map(toItem);
      return json({ items, limit, offset });
    }

    if (!isAdmin) {
      if (req.method === "POST" && parts.length === 0) {
        // Allow public creation for specific types
        const body = (await req.json().catch(() => null)) as any;
        const type = String(body?.type ?? "");
        const allowed = ["registration", "contactMessage", "trialBooking"];
        if (allowed.includes(type)) {
          const status = "published";
          const data = body?.data ?? null;
          const now = Date.now();
          if (!data) return json({ error: "invalid_request" }, { status: 400 });

          const row: ContentRow = {
            id: createId(type),
            type,
            status,
            data,
            created_at: now,
            updated_at: now,
          };
          const { error } = await service.from("content").insert(row);
          if (error) {
            return json({ error: error.message || "server_error" }, { status: 500 });
          }
          return json({ id: row.id });
        }
      }
      return json({ error: "unauthorized" }, { status: 401 });
    }
    const who = await requireAdmin(req);

    if (req.method === "POST" && parts[0] === "bulk") {
      const body = (await req.json().catch(() => null)) as any;
      const action = String(body?.action ?? "");
      const ids = Array.isArray(body?.ids) ? body.ids.map(String) : [];
      if (!["publish", "unpublish", "delete"].includes(action) || ids.length === 0) {
        return json({ error: "invalid_request" }, { status: 400 });
      }

      if (action === "delete") {
        if (who.role !== "admin") return json({ error: "forbidden" }, { status: 403 });
        const { error } = await service.from("content").delete().in("id", ids);
        if (error) {
          const msg = String(error.message ?? "");
          if (msg.toLowerCase().includes("relation") && msg.toLowerCase().includes("content")) {
            return json({ error: "missing_content_table" }, { status: 500 });
          }
          return json({ error: msg || "server_error" }, { status: 500 });
        }
        return json({ ok: true });
      }

      const nextStatus = action === "publish" ? "published" : "draft";
      const { error } = await service
        .from("content")
        .update({ status: nextStatus, updated_at: Date.now() })
        .in("id", ids);
      if (error) {
        const msg = String(error.message ?? "");
        if (msg.toLowerCase().includes("relation") && msg.toLowerCase().includes("content")) {
          return json({ error: "missing_content_table" }, { status: 500 });
        }
        return json({ error: msg || "server_error" }, { status: 500 });
      }
      return json({ ok: true });
    }

    if (req.method === "POST" && parts.length === 0) {
      const body = (await req.json().catch(() => null)) as any;
      const type = String(body?.type ?? "");
      const status = String(body?.status ?? "draft");
      const data = body?.data ?? null;
      const now = Date.now();

      if (!type || !data) return json({ error: "invalid_request" }, { status: 400 });
      if (!["draft", "published"].includes(status)) {
        return json({ error: "invalid_status" }, { status: 400 });
      }

      if (Array.isArray(data)) {
        const rows: ContentRow[] = data.map((d: unknown) => ({
          id: createId(type),
          type,
          status,
          data: d,
          created_at: now,
          updated_at: now,
        }));
        const { error } = await service.from("content").insert(rows);
        if (error) {
          const msg = String(error.message ?? "");
          if (msg.toLowerCase().includes("relation") && msg.toLowerCase().includes("content")) {
            return json({ error: "missing_content_table" }, { status: 500 });
          }
          return json({ error: msg || "server_error" }, { status: 500 });
        }
        return json({ inserted: rows.length, ids: rows.map((r) => r.id) });
      }

      const row: ContentRow = {
        id: createId(type),
        type,
        status,
        data,
        created_at: now,
        updated_at: now,
      };
      const { error } = await service.from("content").insert(row);
      if (error) {
        const msg = String(error.message ?? "");
        if (msg.toLowerCase().includes("relation") && msg.toLowerCase().includes("content")) {
          return json({ error: "missing_content_table" }, { status: 500 });
        }
        return json({ error: msg || "server_error" }, { status: 500 });
      }
      return json({ id: row.id });
    }

    if (req.method === "PUT" && parts.length === 1) {
      const id = parts[0];
      const body = (await req.json().catch(() => null)) as any;
      const data = body?.data ?? null;
      const status = body?.status ? String(body.status) : undefined;
      if (!data) return json({ error: "invalid_request" }, { status: 400 });
      if (status && !["draft", "published"].includes(status)) {
        return json({ error: "invalid_status" }, { status: 400 });
      }
      const patch: any = { data, updated_at: Date.now() };
      if (status) patch.status = status;
      const { error } = await service.from("content").update(patch).eq("id", id);
      if (error) {
        const msg = String(error.message ?? "");
        if (msg.toLowerCase().includes("relation") && msg.toLowerCase().includes("content")) {
          return json({ error: "missing_content_table" }, { status: 500 });
        }
        return json({ error: msg || "server_error" }, { status: 500 });
      }
      return json({ ok: true });
    }

    if (req.method === "DELETE" && parts.length === 1) {
      if (who.role !== "admin") return json({ error: "forbidden" }, { status: 403 });
      const id = parts[0];
      const { error } = await service.from("content").delete().eq("id", id);
      if (error) {
        const msg = String(error.message ?? "");
        if (msg.toLowerCase().includes("relation") && msg.toLowerCase().includes("content")) {
          return json({ error: "missing_content_table" }, { status: 500 });
        }
        return json({ error: msg || "server_error" }, { status: 500 });
      }
      return json({ ok: true });
    }

    return json({ error: "method_not_allowed" }, { status: 405 });
  } catch (e: any) {
    const msg = String(e?.message ?? "server_error");
    const status =
      msg === "missing_token" || msg === "invalid_token" || msg === "not_admin" ? 401 : 500;
    return json({ error: msg }, { status });
  }
});
