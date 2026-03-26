import { getAccessToken } from "../supabase/auth";

function getDevApiFallbackOrigin() {
  if (typeof window === "undefined") return null;
  const isLocalhost =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!isLocalhost) return null;
  if (window.location.port === "5174") return null;
  return `${window.location.protocol}//${window.location.hostname}:5174`;
}

function shouldFallbackToApiOrigin(path: string) {
  return path.startsWith("/api/") || path === "/api" || path.startsWith("/uploads/");
}

function withOrigin(origin: string, path: string) {
  return new URL(path, origin).toString();
}

function getAdminBearer() {
  if (typeof window === "undefined") return null;
  const token = getAccessToken();
  return token ? `Bearer ${token}` : null;
}

function isAbsoluteUrl(path: string) {
  return /^https?:\/\//i.test(path);
}

function withTimeout(options: RequestInit | undefined, timeoutMs: number) {
  const controller = new AbortController();
  const existingSignal = options?.signal;
  if (existingSignal) {
    if (existingSignal.aborted) controller.abort();
    else existingSignal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  const timeoutId = globalThis.setTimeout(() => controller.abort("timeout"), timeoutMs);
  const signal = controller.signal;
  return {
    signal,
    cleanup: () => globalThis.clearTimeout(timeoutId),
  };
}

export async function apiJson(path: string, options?: RequestInit) {
  const bearer =
    path.startsWith("/api/admin") || path.includes("/functions/v1/") ? getAdminBearer() : null;
  const { signal, cleanup } = withTimeout(options, 15000);
  const requestInit: RequestInit = {
    credentials: isAbsoluteUrl(path) ? "omit" : "include",
    headers: {
      "Content-Type": "application/json",
      ...(bearer ? { Authorization: bearer } : {}),
      ...(options?.headers || {}),
    },
    signal,
    ...options,
  };

  let res: Response;
  try {
    res = await fetch(path, requestInit);
  } catch (e) {
    const origin = getDevApiFallbackOrigin();
    if (origin && shouldFallbackToApiOrigin(path)) {
      res = await fetch(withOrigin(origin, path), requestInit);
    } else {
      cleanup();
      if ((e as any)?.name === "AbortError") throw new Error("request_timeout");
      throw e;
    }
  }
  cleanup();

  const origin = getDevApiFallbackOrigin();
  if (
    origin &&
    shouldFallbackToApiOrigin(path) &&
    res.status === 404 &&
    typeof window !== "undefined" &&
    res.url.startsWith(window.location.origin)
  ) {
    try {
      const retry = await fetch(withOrigin(origin, path), requestInit);
      res = retry;
    } catch {
    }
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const error = body?.error || res.statusText || `Request failed with status ${res.status}`;
    throw new Error(error);
  }

  return body;
}

export async function apiUpload(path: string, formData: FormData) {
  const bearer =
    path.startsWith("/api/admin") || path.includes("/functions/v1/") ? getAdminBearer() : null;
  const { signal, cleanup } = withTimeout(undefined, 30000);
  const requestInit: RequestInit = {
    method: "POST",
    body: formData,
    credentials: isAbsoluteUrl(path) ? "omit" : "include",
    headers: {
      ...(bearer ? { Authorization: bearer } : {}),
    },
    signal,
  };

  let res: Response;
  try {
    res = await fetch(path, requestInit);
  } catch (e) {
    const origin = getDevApiFallbackOrigin();
    if (origin && shouldFallbackToApiOrigin(path)) {
      res = await fetch(withOrigin(origin, path), requestInit);
    } else {
      cleanup();
      if ((e as any)?.name === "AbortError") throw new Error("upload_timeout");
      throw e;
    }
  }
  cleanup();

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const error = body?.error || res.statusText || "upload_failed";
    throw new Error(error);
  }

  return body;
}

export async function apiUploadWithHeaders(
  path: string,
  formData: FormData,
  headers: Record<string, string>
) {
  const bearer =
    path.startsWith("/api/admin") || path.includes("/functions/v1/") ? getAdminBearer() : null;
  const { signal, cleanup } = withTimeout(undefined, 30000);
  const requestInit: RequestInit = {
    method: "POST",
    body: formData,
    credentials: isAbsoluteUrl(path) ? "omit" : "include",
    headers: {
      ...(bearer ? { Authorization: bearer } : {}),
      ...headers,
    },
    signal,
  };

  let res: Response;
  try {
    res = await fetch(path, requestInit);
  } catch (e) {
    const origin = getDevApiFallbackOrigin();
    if (origin && shouldFallbackToApiOrigin(path)) {
      res = await fetch(withOrigin(origin, path), requestInit);
    } else {
      cleanup();
      if ((e as any)?.name === "AbortError") throw new Error("upload_timeout");
      throw e;
    }
  }
  cleanup();

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const error = body?.error || res.statusText || "upload_failed";
    throw new Error(error);
  }

  return body;
}
