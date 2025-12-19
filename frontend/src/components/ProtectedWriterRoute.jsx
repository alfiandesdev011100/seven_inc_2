import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useWriterAuth } from "../contexts/useAuth";

/**
 * WRITER PROTECTED ROUTE
 * - Only checks writer auth
 * - Completely isolated from admin/public
 * - Prevents redirect loops
 * - localStorage-based verification
 */
const ProtectedWriterRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useWriterAuth();
  const location = useLocation();

  // PRIMARY CHECK: localStorage (synchronous, always works FIRST)
  const tokenStored = localStorage.getItem("writerToken");
  const dataStored = localStorage.getItem("writerData");
  const isVerified = tokenStored && dataStored;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  console.log("🔒 [ProtectedWriterRoute]", {
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
      console.log("❌ [ProtectedWriterRoute] NOT VERIFIED - redirecting to /login");
      return <Navigate to="/login" replace />;
    }
  }

  // ROLE VALIDATION
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log("❌ [ProtectedWriterRoute] ROLE NOT ALLOWED:", user?.role);
    return <Navigate to="/login" replace />;
  }

  // ACCESS GRANTED
  console.log("✅ [ProtectedWriterRoute] ACCESS GRANTED to:", location.pathname);
  return children;
};

export default ProtectedWriterRoute;
