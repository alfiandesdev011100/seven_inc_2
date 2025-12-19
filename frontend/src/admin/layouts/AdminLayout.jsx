import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/useAuth";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAdminAuth();
  const [scrolled, setScrolled] = useState(false);

  // Efek shadow pada header saat di-scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi Logout
  const handleLogout = () => {
    console.log("👋 [AdminLayout] Logging out admin...");
    logout();
    console.log("✅ [AdminLayout] Admin logged out, redirecting to /login");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-[#111827] overflow-hidden">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 w-64">
        <AdminSidebar onLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden ml-64">
        {/* Top Header */}
        <header
          className={`sticky top-0 z-30 flex items-center justify-between w-full px-6 py-4 bg-[#1E293B] transition-all duration-200 border-b border-gray-700 ${
            scrolled ? "shadow-md" : ""
          }`}
        >
          {/* Left Side */}
          <div>
            <h2 className="text-xl font-bold text-white">Dashboard Admin</h2>
            <p className="text-xs text-gray-400">
              Selamat Datang, <span className="font-semibold text-blue-400">{user?.name || "Admin"}</span>
            </p>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Role Badge */}
            <div
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                user?.role === "admin"
                  ? "bg-purple-900 text-purple-200 border border-purple-700"
                  : "bg-blue-900 text-blue-200 border border-blue-700"
              }`}
            >
              {user?.role === "admin" ? "Admin" : "Admin Konten"}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="w-full px-6 py-8 mx-auto">
          <div className="animate__animated animate__fadeIn">
            {children}
          </div>

          {/* Footer */}
          <footer className="mt-10 text-center text-xs text-gray-500 pb-4">
            &copy; {new Date().getFullYear()} Seven INC Admin Panel. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
