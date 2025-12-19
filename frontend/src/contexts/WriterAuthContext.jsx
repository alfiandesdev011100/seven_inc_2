import React, { createContext, useState, useEffect } from "react";

/**
 * ISOLATED WRITER AUTH CONTEXT
 * - Completely independent state
 * - No interaction with admin or public auth
 * - Uses writerToken & writerData in localStorage
 * - Pure writer functionality only
 */
export const WriterAuthContext = createContext();

export const WriterAuthProvider = ({ children }) => {
  const [writerAuth, setWriterAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load writer auth on mount ONLY
  useEffect(() => {
    console.log("🟡 [WriterAuthContext] Initializing...");
    try {
      const token = localStorage.getItem("writerToken");
      const data = localStorage.getItem("writerData");

      if (token && data) {
        const parsedData = JSON.parse(data);
        setWriterAuth({ token, data: parsedData });
        console.log("✅ [WriterAuthContext] Writer loaded from localStorage");
      } else {
        console.log("ℹ️ [WriterAuthContext] No writer auth found");
      }
    } catch (err) {
      console.error("❌ [WriterAuthContext] Load error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token, writer) => {
    console.log("🔐 [WriterAuthContext.login] Saving writer:", { 
      token: token.substring(0, 20) + "...", 
      email: writer.email 
    });
    
    localStorage.setItem("writerToken", token);
    localStorage.setItem("writerData", JSON.stringify(writer));
    setWriterAuth({ token, data: writer });
    setError(null);
    
    console.log("✅ [WriterAuthContext.login] Writer saved & state updated");
  };

  const logout = () => {
    console.log("🚪 [WriterAuthContext.logout] Clearing writer...");
    
    localStorage.removeItem("writerToken");
    localStorage.removeItem("writerData");
    setWriterAuth(null);
    
    console.log("✅ [WriterAuthContext.logout] Writer cleared");
  };

  const value = {
    writerAuth,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!writerAuth,
  };

  return (
    <WriterAuthContext.Provider value={value}>
      {children}
    </WriterAuthContext.Provider>
  );
};

export default WriterAuthContext;
