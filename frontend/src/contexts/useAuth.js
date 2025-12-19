import { useContext } from "react";
import { AdminAuthContext } from "./AdminAuthContext";
import { WriterAuthContext } from "./WriterAuthContext";
import { PublicAuthContext } from "./PublicAuthContext";

/**
 * ADMIN AUTH HOOK
 * Returns: { isAuthenticated, token, user, login, logout, loading }
 * COMPLETELY ISOLATED - only admin auth
 */
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return {
    isAuthenticated: context.isAuthenticated,
    token: context.adminAuth?.token,
    user: context.adminAuth?.data,
    login: context.login,
    logout: context.logout,
    loading: context.loading,
    error: context.error,
  };
};

/**
 * WRITER AUTH HOOK
 * Returns: { isAuthenticated, token, user, login, logout, loading }
 * COMPLETELY ISOLATED - only writer auth
 */
export const useWriterAuth = () => {
  const context = useContext(WriterAuthContext);
  if (!context) {
    throw new Error("useWriterAuth must be used within WriterAuthProvider");
  }
  return {
    isAuthenticated: context.isAuthenticated,
    token: context.writerAuth?.token,
    user: context.writerAuth?.data,
    login: context.login,
    logout: context.logout,
    loading: context.loading,
    error: context.error,
  };
};

/**
 * PUBLIC AUTH HOOK
 * Returns: { isAuthenticated, loading }
 * NEVER CHANGES - public is always available
 */
export const usePublicAuth = () => {
  const context = useContext(PublicAuthContext);
  if (!context) {
    throw new Error("usePublicAuth must be used within PublicAuthProvider");
  }
  return {
    isAuthenticated: true,
    loading: false,
  };
};

/**
 * LEGACY - kept for backward compatibility
 * DO NOT USE - use specific hooks instead
 */
export const useAuth = () => {
  throw new Error(
    "useAuth is deprecated. Use useAdminAuth, useWriterAuth, or usePublicAuth instead"
  );
};
