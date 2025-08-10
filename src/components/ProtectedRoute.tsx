import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  allowedRoles?: string[];
  children: React.ReactNode;
};

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { session, roles, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!session) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (allowedRoles && !roles.includes("admin") && !roles.some((r) => allowedRoles.includes(r))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
