import { apiJson, apiUpload, apiUploadWithHeaders } from "../lib/http";
import type { AdminContentItem, ContentItem, ContentStatus, ContentType } from "./types";
import { getSupabaseConfig } from "../supabase/config";
import { getAccessToken } from "../supabase/auth";

function playersFunctionBaseUrl() {
  const { url } = getSupabaseConfig();
  if (!url) return null;
  return new URL("/functions/v1/players", url).toString();
}

function contentFunctionBaseUrl() {
  const { url } = getSupabaseConfig();
  if (!url) return null;
  return new URL("/functions/v1/content", url).toString();
}

function supabaseAdminHeaders() {
  const token = getAccessToken();
  if (!token) throw new Error("missing_token");
  return { "x-admin": "1", Authorization: `Bearer ${token}` };
}

export async function fetchPublicContent<T>(type: ContentType): Promise<ContentItem<T>[]> {
  if (type === "player") {
    const fn = playersFunctionBaseUrl();
    if (fn) {
      const res = await apiJson(fn);
      return res.items as ContentItem<T>[];
    }
    try {
      const res = await apiJson(`/api/public/players`);
      return res.items as ContentItem<T>[];
    } catch (e: any) {
      if (String(e?.message) !== "supabase_not_configured") throw e;
    }
  }
  const contentFn = contentFunctionBaseUrl();
  if (contentFn) {
    try {
      const res = await apiJson(`${contentFn}?type=${encodeURIComponent(type)}&status=published`);
      return res.items as ContentItem<T>[];
    } catch (e: any) {
      if (String(e?.message) !== "supabase_not_configured") throw e;
    }
  }
  const res = await apiJson(`/api/public/content?type=${encodeURIComponent(type)}`);
  return res.items as ContentItem<T>[];
}

export async function createPublicRegistration<T>(data: T) {
  const contentFn = contentFunctionBaseUrl();
  if (contentFn) {
    try {
      const res = await apiJson(contentFn, {
        method: "POST",
        body: JSON.stringify({ type: "registration", data, status: "published" }),
      });
      return res.id as string;
    } catch (e: any) {
      if (String(e?.message) !== "supabase_not_configured") throw e;
    }
  }
  const res = await apiJson("/api/public/registrations", {
    method: "POST",
    body: JSON.stringify({ data }),
  });
  return res.id as string;
}

export async function createPublicTrialBooking<T>(data: T) {
  const contentFn = contentFunctionBaseUrl();
  if (contentFn) {
    try {
      const res = await apiJson(contentFn, {
        method: "POST",
        body: JSON.stringify({ type: "trialBooking", data, status: "published" }),
      });
      return res.id as string;
    } catch (e: any) {
      if (String(e?.message) !== "supabase_not_configured") throw e;
    }
  }
  const res = await apiJson("/api/public/trial-bookings", {
    method: "POST",
    body: JSON.stringify({ data }),
  });
  return res.id as string;
}

export async function createPublicContactMessage<T>(data: T) {
  const contentFn = contentFunctionBaseUrl();
  if (contentFn) {
    try {
      const res = await apiJson(contentFn, {
        method: "POST",
        body: JSON.stringify({ type: "contactMessage", data, status: "published" }),
      });
      return res.id as string;
    } catch (e: any) {
      if (String(e?.message) !== "supabase_not_configured") throw e;
    }
  }
  const res = await apiJson("/api/public/contact-messages", {
    method: "POST",
    body: JSON.stringify({ data }),
  });
  return res.id as string;
}

export async function fetchAdminContent<T>(params: {
  type?: ContentType;
  status?: ContentStatus;
  q?: string;
}): Promise<AdminContentItem<T>[]> {
  if (params.type === "player") {
    const fn = playersFunctionBaseUrl();
    if (fn) {
      const res = await apiJson(fn, { headers: supabaseAdminHeaders() });
      return res.items as AdminContentItem<T>[];
    }
    try {
      const res = await apiJson(`/api/admin/players`);
      return res.items as AdminContentItem<T>[];
    } catch (e: any) {
      if (String(e?.message) !== "supabase_not_configured") throw e;
    }
  }
  const contentFn = contentFunctionBaseUrl();
  if (contentFn) {
    const qs = new URLSearchParams();
    if (params.type) qs.set("type", params.type);
    if (params.status) qs.set("status", params.status);
    if (params.q) qs.set("q", params.q);
    const res = await apiJson(`${contentFn}?${qs.toString()}`, { headers: supabaseAdminHeaders() });
    return res.items as AdminContentItem<T>[];
  }
  const qs = new URLSearchParams();
  if (params.type) qs.set("type", params.type);
  if (params.status) qs.set("status", params.status);
  if (params.q) qs.set("q", params.q);
  const res = await apiJson(`/api/admin/content?${qs.toString()}`);
  return res.items as AdminContentItem<T>[];
}

export async function createAdminContent<T>(type: ContentType, data: T, status: ContentStatus) {
  if (type === "player") {
    const fn = playersFunctionBaseUrl();
    if (fn) {
      const res = await apiJson(fn, {
        method: "POST",
        headers: supabaseAdminHeaders(),
        body: JSON.stringify({ data, status }),
      });
      const id = (res?.id as string | undefined) || (Array.isArray(res?.ids) ? res.ids[0] : undefined);
      if (!id) throw new Error("create_failed");
      return id;
    }
    try {
      const res = await apiJson("/api/admin/players", {
        method: "POST",
        body: JSON.stringify({ data, status }),
      });
      return res.id as string;
    } catch (e: any) {
      if (String(e?.message) !== "supabase_not_configured") throw e;
    }
  }
  const contentFn = contentFunctionBaseUrl();
  if (contentFn) {
    const res = await apiJson(contentFn, {
      method: "POST",
      headers: supabaseAdminHeaders(),
      body: JSON.stringify({ type, data, status }),
    });
    const id = (res?.id as string | undefined) || (Array.isArray(res?.ids) ? res.ids[0] : undefined);
    if (!id) throw new Error("create_failed");
    return id;
  }
  const res = await apiJson("/api/admin/content", {
    method: "POST",
    body: JSON.stringify({ type, data, status }),
  });
  return res.id as string;
}

export async function updateAdminContent<T>(id: string, data: T, status?: ContentStatus) {
  if (id.startsWith("player_")) {
    const fn = playersFunctionBaseUrl();
    if (fn) {
      await apiJson(`${fn}/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: supabaseAdminHeaders(),
        body: JSON.stringify({ data, status }),
      });
      return;
    }
    try {
      await apiJson(`/api/admin/players/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify({ data, status }),
      });
      return;
    } catch (e: any) {
      if (String(e?.message) !== "supabase_not_configured") throw e;
    }
  }
  const contentFn = contentFunctionBaseUrl();
  if (contentFn) {
    await apiJson(`${contentFn}/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: supabaseAdminHeaders(),
      body: JSON.stringify({ data, status }),
    });
    return;
  }
  await apiJson(`/api/admin/content/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({ data, status }),
  });
}

export async function deleteAdminContent(id: string) {
  if (id.startsWith("player_")) {
    const fn = playersFunctionBaseUrl();
    if (fn) {
      await apiJson(`${fn}/${encodeURIComponent(id)}`, { method: "DELETE", headers: supabaseAdminHeaders() });
      return;
    }
    try {
      await apiJson(`/api/admin/players/${encodeURIComponent(id)}`, { method: "DELETE" });
      return;
    } catch (e: any) {
      if (String(e?.message) !== "supabase_not_configured") throw e;
    }
  }
  const contentFn = contentFunctionBaseUrl();
  if (contentFn) {
    await apiJson(`${contentFn}/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: supabaseAdminHeaders(),
    });
    return;
  }
  await apiJson(`/api/admin/content/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function bulkAdminContent(ids: string[], action: "publish" | "unpublish" | "delete") {
  const contentFn = contentFunctionBaseUrl();
  if (contentFn) {
    await apiJson(`${contentFn}/bulk`, {
      method: "POST",
      headers: supabaseAdminHeaders(),
      body: JSON.stringify({ ids, action }),
    });
    return;
  }
  await apiJson(`/api/admin/content/bulk`, { method: "POST", body: JSON.stringify({ ids, action }) });
}

export async function login(username: string, password: string) {
  return apiJson("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function logout() {
  return apiJson("/api/auth/logout", { method: "POST" });
}

export async function me() {
  return apiJson("/api/auth/me");
}

export async function uploadImage(file: File) {
  const maxMbRaw = (import.meta as any)?.env?.VITE_MAX_UPLOAD_MB;
  const maxMb = Number.isFinite(Number(maxMbRaw)) ? Number(maxMbRaw) : 5;
  const maxBytes = Math.max(1, maxMb) * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`file_too_large_max_${maxMb}mb`);
  }
  const fd = new FormData();
  fd.append("file", file);
  const { url } = getSupabaseConfig();
  if (url) {
    const fn = new URL("/functions/v1/upload", url).toString();
    const res = await apiUploadWithHeaders(fn, fd, { "x-admin": "1" });
    return res.image as {
      originalUrl: string;
      largeUrl: string;
      mediumUrl: string;
      thumbUrl: string;
    };
  }
  const res = await apiUpload("/api/admin/upload", fd);
  return res.image as {
    originalUrl: string;
    largeUrl: string;
    mediumUrl: string;
    thumbUrl: string;
  };
}

export async function exportBackup() {
  return apiJson("/api/admin/backup");
}

export async function restoreBackup(content: unknown) {
  return apiJson("/api/admin/restore", { method: "POST", body: JSON.stringify(content) });
}

export async function fetchAudit(params: { limit?: number; offset?: number } = {}) {
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.offset) qs.set("offset", String(params.offset));
  return apiJson(`/api/admin/audit?${qs.toString()}`);
}
