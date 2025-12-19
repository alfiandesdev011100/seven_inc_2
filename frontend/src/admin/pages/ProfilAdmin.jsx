import React, { useState } from "react";
import { useAdminAuth } from "../../contexts/useAuth";

const ProfilAdmin = () => {
    const { user, logout } = useAdminAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        avatar: user?.avatar || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [saved, setSaved] = useState(false);

    const handleSaveProfile = async () => {
        try {
            console.log("💾 [ProfilAdmin] Saving profile...");
            // TODO: Send to API: PUT /api/admin/profil
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            setIsEditing(false);
        } catch (error) {
            console.error("❌ [ProfilAdmin] Error:", error);
        }
    };

    const handleLogout = () => {
        console.log("👋 [ProfilAdmin] User initiating logout...");
        logout();
        // Navigate will happen in AdminLayout via useEffect
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Pengaturan Profil</h1>

            {/* Profile Card */}
            <div className="bg-[#1E293B] rounded-lg border border-gray-700 p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
                            {user?.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                            <p className="text-gray-400">{user?.email}</p>
                            <div className="mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    user?.role === "admin"
                                        ? "bg-purple-900/30 text-purple-400"
                                        : "bg-blue-900/30 text-blue-400"
                                }`}>
                                    {user?.role === "admin" ? "Admin" : "Admin Konten"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                        <i className="ri-edit-line mr-2"></i>
                        {isEditing ? "Batal" : "Edit Profil"}
                    </button>
                </div>

                {saved && (
                    <div className="mb-6 p-3 bg-green-900/20 border border-green-700 rounded-lg text-green-400 text-sm">
                        ✓ Profil berhasil diperbarui
                    </div>
                )}

                {isEditing && (
                    <div className="space-y-4 border-t border-gray-700 pt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Nama</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="border-t border-gray-700 pt-4">
                            <h3 className="font-medium text-white mb-4">Ubah Password</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Password Saat Ini
                                </label>
                                <input
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, currentPassword: e.target.value })
                                    }
                                    className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 mb-4"
                                    placeholder="Masukkan password saat ini"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, newPassword: e.target.value })
                                    }
                                    className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 mb-4"
                                    placeholder="Masukkan password baru"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Konfirmasi Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                    }
                                    className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Konfirmasi password baru"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 border-t border-gray-700 pt-6">
                            <button
                                onClick={handleSaveProfile}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                            >
                                <i className="ri-save-line mr-2"></i>
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Security & Logout Section */}
            <div className="bg-[#1E293B] rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Keamanan & Akses</h3>
                <div className="space-y-3">
                    <p className="text-gray-400 text-sm">
                        <i className="ri-shield-check-line text-green-400 mr-2"></i>
                        Akun Anda dilindungi dengan enkripsi keamanan tingkat enterprise
                    </p>
                    <p className="text-gray-400 text-sm">
                        <i className="ri-time-line text-blue-400 mr-2"></i>
                        Terakhir login: Hari ini
                    </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition font-medium"
                    >
                        <i className="ri-logout-box-line mr-2"></i>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilAdmin;
