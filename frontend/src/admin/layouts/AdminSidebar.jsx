import React from "react";
import { useAdminAuth } from "../../contexts/useAuth";

const AdminSidebar = ({ onLogout }) => {
    const { user } = useAdminAuth();
    // Sidebar always expanded - no toggle
    const collapsed = false;

    const menuItems = [
        { label: "Dashboard", icon: "ri-dashboard-line", href: "/admin-portal" },
        { label: "Berita", icon: "ri-file-text-line", href: "/admin-portal/berita" },
        { label: "Kategori", icon: "ri-folder-line", href: "/admin-portal/kategori" },
        { label: "Lowongan Kerja", icon: "ri-briefcase-line", href: "/admin-portal/lowongan-kerja" },
        { label: "Internship", icon: "ri-school-line", href: "/admin-portal/internship" },
        { label: "Tentang Kami", icon: "ri-information-line", href: "/admin-portal/tentang-kami" },
        { label: "Bisnis Kami", icon: "ri-store-line", href: "/admin-portal/bisnis-kami" },
        { label: "Kontak", icon: "ri-mail-line", href: "/admin-portal/kontak" },
        { label: "Profil", icon: "ri-user-settings-line", href: "/admin-portal/profil" },
    ];

    return (
        <aside
            className={`h-full bg-[#0F172A] border-r border-gray-700 flex flex-col transition-all duration-300 ${
                collapsed ? "w-20" : "w-64"
            }`}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                        <p className="text-xs text-gray-400">v1.0</p>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className={`px-4 py-4 border-b border-gray-700 ${collapsed ? "text-center" : ""}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                    {!collapsed && (
                        <div>
                            <p className="text-sm font-semibold text-white">{user?.name || "Admin"}</p>
                            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-2">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#1E293B] hover:text-white transition group"
                        title={collapsed ? item.label : ""}
                    >
                        <i className={`${item.icon} text-lg flex-shrink-0`}></i>
                        {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </a>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-lg transition"
                >
                    <i className="ri-logout-box-line text-lg"></i>
                    {!collapsed && <span className="text-sm font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
