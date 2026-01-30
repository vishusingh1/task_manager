// src/components/ProtectedRoute.tsx
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthAPI } from "../api/auth.api";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        await AuthAPI.me(); // interceptor sends token
        if (mounted) setAuthed(true);
      } catch (err) {
        if (mounted) setAuthed(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    check();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Checking authentication...</div>;
  if (!authed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
