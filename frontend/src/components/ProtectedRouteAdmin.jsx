import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRouteAdmin = ({ children }) => {
    const token = localStorage.getItem("adminToken");

    // Jika tidak ada token, redirect ke halaman login admin
    if (!token) {
        return <Navigate to="/admin-login" replace />;
    }

    // Jika ada token, tampilkan halaman admin
    return children;
};

export default ProtectedRouteAdmin;