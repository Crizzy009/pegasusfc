import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getAccessToken, supabaseGetUser, supabaseLogin, supabaseLogout, supabaseRefresh } from "../supabase/auth";

type AdminUser = { id: string; email?: string; role: string };

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
      } else {
        setUser({ id: u.id, email: u.email, role: "admin" });
      }
    } catch (e: any) {
      setUser(null);
      setError(e?.message || "auth_failed");
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const email = localStorage.getItem("supabase_user_email") || undefined;
      setUser({ id: "", email, role: "admin" });
      setLoading(false);
      void refresh({ silent: true });
    } else {
      void refresh();
    }
  }, [refresh]);

  const login = useCallback(async (usernameOrEmail: string, password: string) => {
    setError(null);
    const u = await supabaseLogin(usernameOrEmail, password);
    if (u.email) localStorage.setItem("supabase_user_email", u.email);
    setUser({ id: u.id, email: u.email, role: "admin" });
  }, [refresh]);

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
