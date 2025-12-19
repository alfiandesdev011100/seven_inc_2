import React from "react";
import { useNavigate } from "react-router-dom";
import { useWriterAuth } from "../../contexts/useAuth";

const WriterSidebar = () => {
    const navigate = useNavigate();
    const { logout, user } = useWriterAuth();

    const handleLogout = () => {
        console.log("👋 [WriterSidebar] Logging out writer...");
        logout();
        console.log("✅ [WriterSidebar] Writer logged out, redirecting to /login");
        navigate("/login", { replace: true });
    };

    return (
        <aside className="w-64 bg-[#0F172A] p-6 border-r border-gray-700 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Writer Hub</h1>
                <p className="text-gray-400 text-sm">Welcome back, {user?.name || "Writer"}!</p>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2">
                <a
                    href="/writer-portal"
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-[#1E293B] hover:text-white transition"
                >
                    <i className="ri-dashboard-line mr-2"></i> Dashboard
                </a>

                <a
                    href="/writer-portal/berita"
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-[#1E293B] hover:text-white transition"
                >
                    <i className="ri-file-text-line mr-2"></i> Kelola Berita
                </a>

                <a
                    href="/writer-portal/kategori"
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-[#1E293B] hover:text-white transition"
                >
                    <i className="ri-folder-line mr-2"></i> Kategori
                </a>

                <a
                    href="/writer-portal/media"
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-[#1E293B] hover:text-white transition"
                >
                    <i className="ri-image-add-line mr-2"></i> Manajemen Media
                </a>

                <a
                    href="/writer-portal/profil"
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-[#1E293B] hover:text-white transition"
                >
                    <i className="ri-user-line mr-2"></i> Profil
                </a>
            </nav>

            {/* Logout Button */}
            <div className="mt-8 pt-8 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
                >
                    <i className="ri-logout-box-line mr-2"></i> Logout
                </button>
            </div>
        </aside>
    );
};

export default WriterSidebar;
