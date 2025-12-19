import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

const KontakAdmin = () => {
    const [contact, setContact] = useState({
        address: "",
        phone: "",
        email: "",
        whatsapp: "",
        description: "",
    });
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchContact();
    }, []);

    const fetchContact = async () => {
        try {
            console.log("📧 [KontakAdmin] Fetching contact data...");
            const token = localStorage.getItem("adminToken");
            const response = await axios.get(`${API_BASE}/admin/kontak`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (response.data.data) {
                setContact(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("❌ [KontakAdmin] Error:", error);
            setError("Gagal mengambil data kontak");
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setError("");
            console.log("💾 [KontakAdmin] Saving contact...");
            
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setError("Token tidak ditemukan");
                return;
            }

            const response = await axios.put(`${API_BASE}/admin/kontak`, contact, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            if (response.data.status) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
                setIsEditing(false);
            } else {
                setError(response.data.message || "Gagal menyimpan data");
            }
        } catch (error) {
            console.error("❌ [KontakAdmin] Error saving:", error);
            setError(error.response?.data?.message || "Gagal menyimpan data");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Informasi Kontak</h1>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                    <i className="ri-edit-line mr-2"></i>
                    {isEditing ? "Batal" : "Edit"}
                </button>
            </div>

            {saved && (
                <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg text-green-400 text-sm">
                    ✓ Data kontak berhasil diperbarui
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-sm">
                    ✕ {error}
                </div>
            )}

            <div className="bg-[#1E293B] rounded-lg border border-gray-700 p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Alamat</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={contact.address}
                            onChange={(e) => setContact({ ...contact, address: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="Alamat perusahaan"
                        />
                    ) : (
                        <p className="text-gray-300">{contact.address || "-"}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Telepon</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={contact.phone}
                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="Nomor telepon"
                        />
                    ) : (
                        <p className="text-gray-300">{contact.phone || "-"}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    {isEditing ? (
                        <input
                            type="email"
                            value={contact.email}
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="Email perusahaan"
                        />
                    ) : (
                        <p className="text-gray-300">{contact.email || "-"}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={contact.whatsapp}
                            onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="Nomor WhatsApp (dengan kode negara)"
                        />
                    ) : (
                        <p className="text-gray-300">{contact.whatsapp || "-"}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
                    {isEditing ? (
                        <textarea
                            value={contact.description}
                            onChange={(e) => setContact({ ...contact, description: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 h-20 resize-none"
                            placeholder="Deskripsi atau catatan tambahan"
                        ></textarea>
                    ) : (
                        <p className="text-gray-300">{contact.description || "-"}</p>
                    )}
                </div>

                {isEditing && (
                    <div className="pt-4">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                        >
                            <i className="ri-save-line mr-2"></i>
                            Simpan Perubahan
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KontakAdmin;
