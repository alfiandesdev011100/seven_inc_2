import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRouteAdmin = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("adminToken");
  const adminDataString = localStorage.getItem("adminData");
  const location = useLocation();

  // ================================
  // 1. CEK LOGIN
  // ================================
  if (!token || !adminDataString) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const adminData = JSON.parse(adminDataString);
  const userRole = adminData.role;

  // ================================
  // 2. CEK ROLE (Authorization)
  // ================================
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {

    // Fallback khusus admin
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // Fallback role admin_konten / writer
    return <Navigate to="/admin/berita" replace />;
  }

  // ================================
  // 3. JIKA LOLOS SEMUA CEK → IZINKAN
  // ================================
  return children;
};

export default ProtectedRouteAdmin;
