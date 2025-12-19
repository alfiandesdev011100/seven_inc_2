import React, { createContext, useState, useEffect } from "react";

/**
 * PUBLIC AUTH CONTEXT
 * - Completely independent state
 * - NO authentication required
 * - Uses publicAuth in localStorage (optional)
 * - Completely isolated from admin & writer
 * - DO NOT MODIFY THIS CONTEXT
 */
export const PublicAuthContext = createContext();

export const PublicAuthProvider = ({ children }) => {
  const [publicAuth] = useState({
    isAuthenticated: true, // Public is always "authenticated"
    loading: false,
  });

  // Public auth doesn't need initialization
  // It's always available, always public

  const value = {
    publicAuth,
    isAuthenticated: true,
    loading: false,
  };

  return (
    <PublicAuthContext.Provider value={value}>
      {children}
    </PublicAuthContext.Provider>
  );
};

export default PublicAuthContext;
