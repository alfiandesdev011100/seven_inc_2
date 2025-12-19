import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../../contexts/useAuth";

const BeritaAdmin = () => {
    const { token: adminToken } = useAdminAuth();
    const [berita, setBerita] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category_id: "",
        is_published: false,
    });

    const headers = {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
    };

    useEffect(() => {
        fetchData();
    }, [adminToken]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [newsRes, catRes] = await Promise.all([
                fetch("http://localhost:8000/api/admin/news", { headers }),
                fetch("http://localhost:8000/api/categories", { headers }),
            ]);

            if (!newsRes.ok || !catRes.ok) {
                throw new Error("Gagal mengambil data");
            }

            const newsData = await newsRes.json();
            const catData = await catRes.json();

            setBerita(newsData.data?.list || []);
            setCategories(catData.data?.list || []);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Gagal mengambil data berita");
        } finally {
            setLoading(false);
        }
    };

    const handleAddBerita = () => {
        setEditingId(null);
        setFormData({
            title: "",
            content: "",
            category_id: "",
            is_published: false,
        });
        setShowModal(true);
    };

    const handleEditBerita = (item) => {
        setEditingId(item.id);
        setFormData({
            title: item.title,
            content: item.content,
            category_id: item.category_id || "",
            is_published: item.is_published || false,
        });
        setShowModal(true);
    };

    const handleDeleteBerita = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;

        try {
            const response = await fetch(`http://localhost:8000/api/admin/news/${id}`, {
                method: "DELETE",
                headers,
            });

            if (!response.ok) throw new Error("Gagal menghapus berita");

            setBerita(berita.filter((b) => b.id !== id));
        } catch (err) {
            alert("Gagal menghapus berita: " + err.message);
        }
    };

    const handleApproveNews = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/admin/news/${id}/approve`, {
                method: "POST",
                headers,
            });

            if (!response.ok) throw new Error("Gagal menyetujui berita");

            const updatedNews = await response.json();
            setBerita(
                berita.map((b) => (b.id === id ? updatedNews.data : b))
            );
        } catch (err) {
            alert("Gagal menyetujui berita: " + err.message);
        }
    };

    const handleSaveBerita = async () => {
        if (!formData.title.trim()) {
            alert("Judul berita tidak boleh kosong");
            return;
        }

        setSubmitting(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId
                ? `http://localhost:8000/api/admin/news/${editingId}`
                : "http://localhost:8000/api/admin/news";

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Gagal menyimpan berita");

            const result = await response.json();

            if (editingId) {
                setBerita(berita.map((b) => (b.id === editingId ? result.data : b)));
            } else {
                setBerita([result.data, ...berita]);
            }

            setShowModal(false);
        } catch (err) {
            alert("Gagal menyimpan berita: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Filter berita berdasarkan search dan status
    const filteredBerita = berita.filter((item) => {
        const matchesSearch = item.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === "all" ||
            (filterStatus === "published" && item.is_published) ||
            (filterStatus === "draft" && !item.is_published);
        return matchesSearch && matchesStatus;
    });

    const getCategoryName = (categoryId) => {
        const cat = categories.find((c) => c.id === categoryId);
        return cat ? cat.name : "Uncategorized";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">📰 Kelola Berita</h1>
                    <p className="text-gray-400 mt-1">
                        Kelola semua artikel dan berita di platform
                    </p>
                </div>
                <button
                    onClick={handleAddBerita}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                >
                    <i className="ri-add-line text-lg"></i>
                    Tambah Berita
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">
                    {error}
                </div>
            )}

            {/* Search & Filter */}
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Cari berita..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#1E293B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-[#1E293B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                    <option value="all">Semua Status</option>
                    <option value="published">✅ Dipublikasikan</option>
                    <option value="draft">📝 Draft</option>
                </select>
            </div>

            {/* Berita List */}
            <div className="bg-[#1E293B] rounded-lg border border-gray-700 overflow-hidden">
                {filteredBerita.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <i className="ri-file-text-line text-4xl mb-3 opacity-50"></i>
                        <p>
                            {berita.length === 0
                                ? "Belum ada berita. Mulai dengan tambah berita baru."
                                : "Tidak ada berita yang cocok dengan pencarian"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#0F172A] border-b border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        Judul
                                    </th>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-center text-white font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredBerita.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-[#0F172A]/50 transition"
                                    >
                                        <td className="px-6 py-4 text-white font-medium">
                                            {item.title}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {getCategoryName(item.category_id)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    item.is_published
                                                        ? "bg-green-900/30 text-green-400"
                                                        : "bg-yellow-900/30 text-yellow-400"
                                                }`}
                                            >
                                                {item.is_published
                                                    ? "✅ Dipublikasikan"
                                                    : "📝 Draft"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(
                                                item.updated_at
                                            ).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-3">
                                            {!item.is_published && (
                                                <button
                                                    onClick={() =>
                                                        handleApproveNews(item.id)
                                                    }
                                                    className="text-green-400 hover:text-green-300 transition"
                                                    title="Publikasikan"
                                                >
                                                    <i className="ri-check-line"></i>
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleEditBerita(item)
                                                }
                                                className="text-blue-400 hover:text-blue-300 transition"
                                                title="Edit"
                                            >
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteBerita(item.id)
                                                }
                                                className="text-red-400 hover:text-red-300 transition"
                                                title="Hapus"
                                            >
                                                <i className="ri-delete-line"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1E293B] rounded-lg border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {editingId ? "✏️ Edit Berita" : "📝 Tambah Berita"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Judul <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Masukkan judul berita"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Kategori
                                </label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category_id: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Konten <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            content: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 h-32 resize-none"
                                    placeholder="Masukkan konten berita"
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    checked={formData.is_published}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            is_published: e.target.checked,
                                        })
                                    }
                                    className="rounded border-gray-700"
                                />
                                <label
                                    htmlFor="is_published"
                                    className="text-sm font-medium text-gray-300"
                                >
                                    Publikasikan sekarang
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveBerita}
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                            >
                                {submitting ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BeritaAdmin;