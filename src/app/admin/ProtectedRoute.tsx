
import { Navigate } from "react-router";
import { useAdminAuth } from "./auth";
import { Loader2 } from "lucide-react";
import { getAccessToken } from "../supabase/auth";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAdminAuth();

  if (loading) {
    const token = getAccessToken();
    if (token) return children;
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}
