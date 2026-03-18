import { getSupabaseConfig } from "./config";

type SupabaseUser = { id: string; email?: string };

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: SupabaseUser;
};

const ACCESS_TOKEN_KEY = "supabase_access_token";
const REFRESH_TOKEN_KEY = "supabase_refresh_token";

let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;

function requireConfig() {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) throw new Error("supabase_not_configured");
  return { url, anonKey };
}

export function getAccessToken() {
  if (cachedAccessToken) return cachedAccessToken;
  cachedAccessToken =
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    sessionStorage.getItem(ACCESS_TOKEN_KEY);
  return cachedAccessToken;
}

export function setTokens(tokens: { accessToken: string; refreshToken: string }) {
  cachedAccessToken = tokens.accessToken;
  cachedRefreshToken = tokens.refreshToken;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearTokens() {
  cachedAccessToken = null;
  cachedRefreshToken = null;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function supabaseLogin(email: string, password: string) {
  const { url, anonKey } = requireConfig();
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const body = (await res.json().catch(() => null)) as TokenResponse | { error_description?: string } | null;
  if (!res.ok) {
    const msg = (body as any)?.error_description || res.statusText || "login_failed";
    throw new Error(msg);
  }
  const tr = body as TokenResponse;
  setTokens({ accessToken: tr.access_token, refreshToken: tr.refresh_token });
  return tr.user;
}

export async function supabaseRefresh() {
  const { url, anonKey } = requireConfig();
  const refreshToken =
    cachedRefreshToken ||
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;
  const res = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const body = (await res.json().catch(() => null)) as TokenResponse | { error_description?: string } | null;
  if (!res.ok) return null;
  const tr = body as TokenResponse;
  setTokens({ accessToken: tr.access_token, refreshToken: tr.refresh_token });
  return tr.user;
}

export async function supabaseGetUser() {
  const { url, anonKey } = requireConfig();
  const token = getAccessToken();
  if (!token) return null;
  const res = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
  });
  const body = (await res.json().catch(() => null)) as SupabaseUser | null;
  if (!res.ok) return null;
  return body;
}

export async function supabaseLogout() {
  const { url, anonKey } = requireConfig();
  const token = getAccessToken();
  clearTokens();
  if (!token) return;
  void fetch(`${url}/auth/v1/logout`, {
    method: "POST",
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
    keepalive: true,
  }).catch(() => null);
}
