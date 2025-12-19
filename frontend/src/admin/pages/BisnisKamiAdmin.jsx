import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";

const BisnisKamiAdmin = () => {
    const [data, setData] = useState({
        header_subtitle: "",
        header_title: "",
        general_description: "",
        seven_tech_title: "",
        seven_tech_text: "",
        seven_style_title: "",
        seven_style_text: "",
        seven_serve_title: "",
        seven_serve_text: "",
        seven_edu_title: "",
        seven_edu_text: "",
    });
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log("🏢 [BisnisKamiAdmin] Fetching bisnis page data...");
            const response = await axios.get(`${API_BASE}/bisnis-kami-full`);
            if (response.data) {
                setData(response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("❌ [BisnisKamiAdmin] Error:", error);
            setError("Gagal mengambil data");
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setError("");
            console.log("💾 [BisnisKamiAdmin] Saving bisnis page...");
            
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setError("Token tidak ditemukan");
                return;
            }

            const payload = {
                header_subtitle: data.header_subtitle,
                header_title: data.header_title,
                general_description: data.general_description,
                seven_tech_title: data.seven_tech_title,
                seven_tech_text: data.seven_tech_text,
                seven_style_title: data.seven_style_title,
                seven_style_text: data.seven_style_text,
                seven_serve_title: data.seven_serve_title,
                seven_serve_text: data.seven_serve_text,
                seven_edu_title: data.seven_edu_title,
                seven_edu_text: data.seven_edu_text,
            };

            const response = await axios.put(`${API_BASE}/admin/bisnis-kami-full/text`, payload, {
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
            console.error("❌ [BisnisKamiAdmin] Error saving:", error);
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
                <h1 className="text-3xl font-bold text-white">Edit Halaman Bisnis Kami</h1>
                {saved && <span className="text-green-400 text-sm">✓ Tersimpan</span>}
            </div>

            {error && (
                <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-sm">
                    ✕ {error}
                </div>
            )}

            <div className="bg-[#1E293B] rounded-lg border border-gray-700 p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Header Subtitle</label>
                    <input
                        type="text"
                        value={data.header_subtitle}
                        onChange={(e) => setData({ ...data, header_subtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Subtitle header"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Header Title</label>
                    <input
                        type="text"
                        value={data.header_title}
                        onChange={(e) => setData({ ...data, header_title: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Judul header"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Umum</label>
                    <textarea
                        value={data.general_description}
                        onChange={(e) => setData({ ...data, general_description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 h-20 resize-none"
                        placeholder="Deskripsi umum bisnis"
                    ></textarea>
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <h3 className="font-medium text-white mb-4">Seven Tech</h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={data.seven_tech_title}
                            onChange={(e) => setData({ ...data, seven_tech_title: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            placeholder="Judul Seven Tech"
                        />
                        <textarea
                            value={data.seven_tech_text}
                            onChange={(e) => setData({ ...data, seven_tech_text: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 h-20 resize-none"
                            placeholder="Deskripsi Seven Tech"
                        ></textarea>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <h3 className="font-medium text-white mb-4">Seven Style</h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={data.seven_style_title}
                            onChange={(e) => setData({ ...data, seven_style_title: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            placeholder="Judul Seven Style"
                        />
                        <textarea
                            value={data.seven_style_text}
                            onChange={(e) => setData({ ...data, seven_style_text: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 h-20 resize-none"
                            placeholder="Deskripsi Seven Style"
                        ></textarea>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <h3 className="font-medium text-white mb-4">Seven Serve</h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={data.seven_serve_title}
                            onChange={(e) => setData({ ...data, seven_serve_title: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            placeholder="Judul Seven Serve"
                        />
                        <textarea
                            value={data.seven_serve_text}
                            onChange={(e) => setData({ ...data, seven_serve_text: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 h-20 resize-none"
                            placeholder="Deskripsi Seven Serve"
                        ></textarea>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <h3 className="font-medium text-white mb-4">Seven Edu</h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={data.seven_edu_title}
                            onChange={(e) => setData({ ...data, seven_edu_title: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            placeholder="Judul Seven Edu"
                        />
                        <textarea
                            value={data.seven_edu_text}
                            onChange={(e) => setData({ ...data, seven_edu_text: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 h-20 resize-none"
                            placeholder="Deskripsi Seven Edu"
                        ></textarea>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium"
                    >
                        <i className="ri-save-line mr-2"></i>
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BisnisKamiAdmin;
