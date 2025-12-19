import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

/**
 * AuthProvider - Centralized authentication state management
 * Handles admin, writer, and public auth separately
 */
export const AuthProvider = ({ children }) => {
  const [adminAuth, setAdminAuth] = useState(null);
  const [writerAuth, setWriterAuth] = useState(null);
  const [publicAuth, setPublicAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth data dari localStorage saat component mount
  useEffect(() => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const adminData = localStorage.getItem("adminData");
      const writerToken = localStorage.getItem("writerToken");
      const writerData = localStorage.getItem("writerData");

      if (adminToken && adminData) {
        setAdminAuth({
          token: adminToken,
          data: JSON.parse(adminData),
        });
      }

      if (writerToken && writerData) {
        setWriterAuth({
          token: writerToken,
          data: JSON.parse(writerData),
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("❌ [AuthContext] Error loading auth data:", error);
      setLoading(false);
    }
  }, []);

  const loginAdmin = (token, admin) => {
    console.log("📝 [AuthContext] loginAdmin called:", { token, admin });
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminData", JSON.stringify(admin));
    setAdminAuth({ token, data: admin });
    console.log("✅ [AuthContext] adminAuth state updated");
  };

  const loginWriter = (token, writer) => {
    console.log("📝 [AuthContext] loginWriter called:", { token, writer });
    localStorage.setItem("writerToken", token);
    localStorage.setItem("writerData", JSON.stringify(writer));
    setWriterAuth({ token, data: writer });
    console.log("✅ [AuthContext] writerAuth state updated");
  };

  const logoutAdmin = () => {
    console.log("🚪 [AuthContext] logoutAdmin called");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setAdminAuth(null);
  };

  const logoutWriter = () => {
    console.log("🚪 [AuthContext] logoutWriter called");
    localStorage.removeItem("writerToken");
    localStorage.removeItem("writerData");
    setWriterAuth(null);
  };

  const value = {
    adminAuth,
    writerAuth,
    publicAuth,
    loading,
    loginAdmin,
    loginWriter,
    logoutAdmin,
    logoutWriter,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
