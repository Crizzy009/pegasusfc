import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getAccessToken, supabaseGetUser, supabaseLogin, supabaseLogout, supabaseRefresh } from "../supabase/auth";

type AdminRole = "admin" | "editor" | "viewer";

type AdminUser = { id: string; email?: string; role: AdminRole };

function parseEmailList(value: unknown) {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function resolveRole(email?: string | null): AdminRole {
  const adminEmails = parseEmailList((import.meta as any)?.env?.VITE_ADMIN_EMAILS);
  const editorEmails = parseEmailList((import.meta as any)?.env?.VITE_EDITOR_EMAILS);
  if (!adminEmails.length && !editorEmails.length) return "admin";
  const e = (email ?? "").toLowerCase();
  if (e && adminEmails.includes(e)) return "admin";
  if (e && editorEmails.includes(e)) return "editor";
  return "viewer";
}

type AdminAuthState = {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthState | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    setError(null);
    try {
      const refreshed = await supabaseRefresh();
      const u = refreshed ?? (await supabaseGetUser());
      if (!u) {
        setUser(null);
        if (getAccessToken()) {
          // If we had a token but it's no longer valid
          const { clearTokens } = await import("../supabase/auth");
          clearTokens();
          localStorage.removeItem("supabase_user_email");
        }
      } else {
        setUser({ id: u.id, email: u.email, role: resolveRole(u.email) });
      }
    } catch (e: any) {
      setUser(null);
      const { clearTokens } = await import("../supabase/auth");
      clearTokens();
      localStorage.removeItem("supabase_user_email");
      setError(e?.message || "auth_failed");
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const email = localStorage.getItem("supabase_user_email") || undefined;
      setUser({ id: "", email, role: resolveRole(email) });
      setLoading(false);
      void refresh({ silent: true });
    } else {
      void refresh();
    }
  }, [refresh]);

  const login = useCallback(async (usernameOrEmail: string, password: string) => {
    setError(null);
    try {
      const u = await supabaseLogin(usernameOrEmail, password);
      if (u.email) localStorage.setItem("supabase_user_email", u.email);
      setUser({ id: u.id, email: u.email, role: resolveRole(u.email) });
    } catch (e: any) {
      setError(e?.message || "login_failed");
      throw e;
    }
  }, [resolveRole]);

  const logout = useCallback(async () => {
    setError(null);
    await supabaseLogout();
    localStorage.removeItem("supabase_user_email");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      refresh: () => refresh(),
      login,
      logout,
    }),
    [user, loading, error, refresh, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("AdminAuthProvider missing");
  return ctx;
}
