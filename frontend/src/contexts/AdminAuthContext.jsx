import React, { createContext, useState, useEffect } from "react";

/**
 * ISOLATED ADMIN AUTH CONTEXT
 * - Completely independent state
 * - No interaction with writer or public auth
 * - Uses adminToken & adminData in localStorage
 * - Pure admin functionality only
 */
export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminAuth, setAdminAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load admin auth on mount ONLY
  useEffect(() => {
    console.log("🔵 [AdminAuthContext] Initializing...");
    try {
      const token = localStorage.getItem("adminToken");
      const data = localStorage.getItem("adminData");

      if (token && data) {
        const parsedData = JSON.parse(data);
        setAdminAuth({ token, data: parsedData });
        console.log("✅ [AdminAuthContext] Admin loaded from localStorage");
      } else {
        console.log("ℹ️ [AdminAuthContext] No admin auth found");
      }
    } catch (err) {
      console.error("❌ [AdminAuthContext] Load error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token, admin) => {
    console.log("🔐 [AdminAuthContext.login] Saving admin:", { 
      token: token.substring(0, 20) + "...", 
      email: admin.email 
    });
    
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminData", JSON.stringify(admin));
    setAdminAuth({ token, data: admin });
    setError(null);
    
    console.log("✅ [AdminAuthContext.login] Admin saved & state updated");
  };

  const logout = () => {
    console.log("🚪 [AdminAuthContext.logout] Clearing admin...");
    
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setAdminAuth(null);
    
    console.log("✅ [AdminAuthContext.logout] Admin cleared");
  };

  const value = {
    adminAuth,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!adminAuth,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
