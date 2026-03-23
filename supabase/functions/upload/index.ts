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

  const bucket = Deno.env.get("UPLOADS_BUCKET") ?? "uploads";
  const maxUploadBytes = Number(Deno.env.get("MAX_UPLOAD_BYTES") ?? "0");

  if (!url || !anonKey) throw new Error("supabase_not_configured");
  return { url, anonKey, serviceKey, adminEmails, editorEmails, bucket, maxUploadBytes };
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

function safeFileName(name: string) {
  const cleaned = name.replaceAll(/[^a-zA-Z0-9._-]/g, "_");
  return cleaned.length ? cleaned : "file";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (req.method !== "POST") return json({ error: "method_not_allowed" }, { status: 405 });
    if (!clientAdminFlag(req)) return json({ error: "missing_admin_header" }, { status: 401 });

    await requireAdmin(req);

    const { url, serviceKey, bucket, maxUploadBytes } = supabaseEnv();
    if (!serviceKey) return json({ error: "supabase_not_configured" }, { status: 500 });
    const service = createClient(url, serviceKey);

    const form = await req.formData().catch(() => null);
    if (!form) return json({ error: "invalid_request" }, { status: 400 });
    const file = form.get("file");
    if (!(file instanceof File)) return json({ error: "invalid_request" }, { status: 400 });
    if (maxUploadBytes > 0 && file.size > maxUploadBytes) return json({ error: "file_too_large" }, { status: 413 });

    const now = Date.now();
    const ext = safeFileName(file.name).split(".").pop() || "bin";
    const path = `uploads/${now}_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}.${ext}`;

    const { error } = await service.storage.from(bucket).upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (error) return json({ error: error.message }, { status: 500 });

    const publicUrl = `${url}/storage/v1/object/public/${bucket}/${path}`;
    return json({
      image: {
        originalUrl: publicUrl,
        largeUrl: publicUrl,
        mediumUrl: publicUrl,
        thumbUrl: publicUrl,
      },
    });
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
