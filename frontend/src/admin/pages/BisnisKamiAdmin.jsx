import React, { useState, useEffect } from "react";

const BisnisKamiAdmin = () => {
    const [data, setData] = useState({
        title: "Bisnis Kami",
        description: "",
        services: "",
    });
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("🏢 [BisnisKamiAdmin] Fetching bisnis page data...");
                setData({
                    title: "Bisnis Kami",
                    description: "Kami menyediakan berbagai layanan konsultasi digital...",
                    services: "Web Development, Mobile Apps, Cloud Solutions",
                });
                setLoading(false);
            } catch (error) {
                console.error("❌ [BisnisKamiAdmin] Error:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            console.log("💾 [BisnisKamiAdmin] Saving bisnis page...");
            // TODO: Send to API: PUT /api/admin/bisnis-kami
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("❌ [BisnisKamiAdmin] Error saving:", error);
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

            <div className="bg-[#1E293B] rounded-lg border border-gray-700 p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Judul</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData({ ...data, description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 h-24 resize-none"
                        placeholder="Deskripsi bisnis kami"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Layanan</label>
                    <textarea
                        value={data.services}
                        onChange={(e) => setData({ ...data, services: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 h-24 resize-none"
                        placeholder="Daftar layanan (pisahkan dengan koma)"
                    ></textarea>
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
