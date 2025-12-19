import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../contexts/useAuth";

/**
 * ADMIN PROTECTED ROUTE
 * - Only checks admin auth
 * - Completely isolated from writer/public
 * - Prevents redirect loops
 * - localStorage-based verification
 */
const ProtectedAdminRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAdminAuth();
  const location = useLocation();

  // PRIMARY CHECK: localStorage (synchronous, always works FIRST)
  const tokenStored = localStorage.getItem("adminToken");
  const dataStored = localStorage.getItem("adminData");
  const isVerified = tokenStored && dataStored;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  console.log("🔒 [ProtectedAdminRoute]", {
    path: location.pathname,
    isVerified,
    isAuthenticated,
    user: user?.email,
    role: user?.role
  });

  // NOT AUTHENTICATED - redirect to login
  if (!isVerified) {
    // Prevent infinite redirect loop
    if (location.pathname !== "/login") {
      console.log("❌ [ProtectedAdminRoute] NOT VERIFIED - redirecting to /login");
      return <Navigate to="/login" replace />;
    }
  }

  // ROLE VALIDATION
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log("❌ [ProtectedAdminRoute] ROLE NOT ALLOWED:", user?.role);
    return <Navigate to="/login" replace />;
  }

  // ACCESS GRANTED
  console.log("✅ [ProtectedAdminRoute] ACCESS GRANTED to:", location.pathname);
  return children;
};

export default ProtectedAdminRoute;
