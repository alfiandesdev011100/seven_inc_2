import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

const TentangKamiAdmin = () => {
    const [data, setData] = useState({
        subtitle: "",
        headline: "",
        left_p1: "",
        left_p2: "",
        left_p3: "",
        right_p1: "",
        right_p2: "",
        core_title: "",
        core_headline: "",
        core_paragraph: "",
    });
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log("ℹ️ [TentangKamiAdmin] Fetching about page data...");
            const response = await axios.get(`${API_BASE}/admin/about`);
            
            if (response.data.status && response.data.data) {
                setData(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("❌ [TentangKamiAdmin] Error:", error);
            setError("Gagal mengambil data");
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setError("");
            console.log("💾 [TentangKamiAdmin] Saving about page...");
            
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setError("Token tidak ditemukan");
                return;
            }

            const payload = {
                subtitle: data.subtitle,
                headline: data.headline,
                left_p1: data.left_p1,
                left_p2: data.left_p2,
                left_p3: data.left_p3,
                right_p1: data.right_p1,
                right_p2: data.right_p2,
                core_title: data.core_title,
                core_headline: data.core_headline,
                core_paragraph: data.core_paragraph,
            };

            const response = await axios.post(`${API_BASE}/admin/about`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            if (response.data.status) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                setError(response.data.message || "Gagal menyimpan data");
            }
        } catch (error) {
            console.error("❌ [TentangKamiAdmin] Error saving:", error);
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
                <h1 className="text-3xl font-bold text-white">Edit Halaman Tentang Kami</h1>
                {saved && <span className="text-green-400 text-sm">✓ Tersimpan</span>}
            </div>

            {error && (
                <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-sm">
                    ✕ {error}
                </div>
            )}

            <div className="bg-[#1E293B] rounded-lg border border-gray-700 p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
                    <input
                        type="text"
                        value={data.subtitle}
                        onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        placeholder="Subtitle halaman"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Headline</label>
                    <input
                        type="text"
                        value={data.headline}
                        onChange={(e) => setData({ ...data, headline: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        placeholder="Headline utama"
                    />
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <h3 className="font-medium text-white mb-4">Paragraf Kiri</h3>
                    <div className="space-y-3">
                        <textarea
                            value={data.left_p1}
                            onChange={(e) => setData({ ...data, left_p1: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 h-16 resize-none"
                            placeholder="Paragraf kiri 1"
                        ></textarea>
                        <textarea
                            value={data.left_p2}
                            onChange={(e) => setData({ ...data, left_p2: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 h-16 resize-none"
                            placeholder="Paragraf kiri 2"
                        ></textarea>
                        <textarea
                            value={data.left_p3}
                            onChange={(e) => setData({ ...data, left_p3: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 h-16 resize-none"
                            placeholder="Paragraf kiri 3"
                        ></textarea>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <h3 className="font-medium text-white mb-4">Paragraf Kanan</h3>
                    <div className="space-y-3">
                        <textarea
                            value={data.right_p1}
                            onChange={(e) => setData({ ...data, right_p1: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 h-16 resize-none"
                            placeholder="Paragraf kanan 1"
                        ></textarea>
                        <textarea
                            value={data.right_p2}
                            onChange={(e) => setData({ ...data, right_p2: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 h-16 resize-none"
                            placeholder="Paragraf kanan 2"
                        ></textarea>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <h3 className="font-medium text-white mb-4">Core Values</h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={data.core_title}
                            onChange={(e) => setData({ ...data, core_title: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                            placeholder="Judul core values"
                        />
                        <input
                            type="text"
                            value={data.core_headline}
                            onChange={(e) => setData({ ...data, core_headline: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                            placeholder="Headline core values"
                        />
                        <textarea
                            value={data.core_paragraph}
                            onChange={(e) => setData({ ...data, core_paragraph: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 h-16 resize-none"
                            placeholder="Deskripsi core values"
                        ></textarea>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium"
                    >
                        <i className="ri-save-line mr-2"></i>
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TentangKamiAdmin;
