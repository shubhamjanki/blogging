import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function CmsGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, isWriter } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f1117" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <span className="text-sm" style={{ color: "#9ca3af" }}>Checking access...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isAdmin && !isWriter) {
    return <Navigate to="/cms/unauthorized" replace />;
  }

  return <>{children}</>;
}
