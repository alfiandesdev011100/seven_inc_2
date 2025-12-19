import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useWriterAuth } from "../../contexts/useAuth";
import ProtectedWriterRoute from "../../components/ProtectedWriterRoute";

const WriterBerita = () => {
    const { writerToken, writerData } = useWriterAuth();
    const location = useLocation();
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(location.state?.selectedCategory || "");
    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        body: "",
        category_id: location.state?.selectedCategory || "",
        cover: null,
    });

    // Fetch writer's news
    const fetchNews = async (page = 1, query = "") => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                per_page: 10,
                page: page,
                q: query,
            });

            const response = await fetch(
                `http://localhost:8000/api/writer/news?${params}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${writerToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();
            if (data.status) {
                setNewsList(data.data.list);
                setCurrentPage(data.data.meta.current_page);
                setTotalPages(data.data.meta.last_page);
            } else {
                alert("Gagal mengambil data berita");
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            alert("Terjadi kesalahan saat mengambil data");
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/categories",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${writerToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();
            if (data.status) {
                setCategories(data.data?.list || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        if (writerToken) {
            fetchNews(1, searchQuery);
            fetchCategories();
        }
    }, [writerToken]);

    // Handle form input
    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Create new news
    const handleCreateNews = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.body) {
            alert("Judul dan isi berita wajib diisi");
            return;
        }
        if (!formData.category_id) {
            alert("Pilih kategori terlebih dahulu");
            return;
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("excerpt", formData.excerpt);
        data.append("body", formData.body);
        data.append("category_id", formData.category_id);
        if (formData.cover) {
            data.append("cover", formData.cover);
        }

        try {
            const response = await fetch("http://localhost:8000/api/writer/news", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${writerToken}`,
                },
                body: data,
            });

            const result = await response.json();
            if (result.status) {
                alert("Berita berhasil dibuat");
                setShowModal(false);
                setFormData({ title: "", excerpt: "", body: "", category_id: "", cover: null });
                fetchNews(1, searchQuery);
            } else {
                alert("Gagal membuat berita: " + (result.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error creating news:", error);
            alert("Terjadi kesalahan");
        }
    };

    // Update news
    const handleUpdateNews = async (e) => {
        e.preventDefault();
        if (!editingNews.id) return;

        const data = new FormData();
        data.append("title", formData.title);
        data.append("excerpt", formData.excerpt);
        data.append("body", formData.body);
        if (formData.cover) {
            data.append("cover", formData.cover);
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/writer/news/${editingNews.id}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${writerToken}`,
                    },
                    body: data,
                }
            );

            const result = await response.json();
            if (result.status) {
                alert("Berita berhasil diperbarui");
                setShowModal(false);
                setEditingNews(null);
                setFormData({ title: "", excerpt: "", body: "", cover: null });
                fetchNews(currentPage, searchQuery);
            } else {
                alert("Gagal memperbarui berita");
            }
        } catch (error) {
            console.error("Error updating news:", error);
            alert("Terjadi kesalahan");
        }
    };

    // Delete news
    const handleDeleteNews = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus berita ini?"))
            return;

        try {
            const response = await fetch(
                `http://localhost:8000/api/writer/news/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${writerToken}`,
                    },
                }
            );

            const result = await response.json();
            if (result.status) {
                alert("Berita berhasil dihapus");
                fetchNews(currentPage, searchQuery);
            } else {
                alert("Gagal menghapus berita");
            }
        } catch (error) {
            console.error("Error deleting news:", error);
            alert("Terjadi kesalahan");
        }
    };

    // Open edit modal
    const openEditModal = (news) => {
        setEditingNews(news);
        setFormData({
            title: news.title,
            excerpt: news.excerpt || "",
            body: news.body,
            cover: null,
        });
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingNews(null);
        setFormData({ title: "", excerpt: "", body: "", cover: null });
    };

    // Search
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchNews(1, searchQuery);
    };

    return (
        <ProtectedWriterRoute>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] rounded-lg p-6 border border-gray-700">
                    <h1 className="text-4xl font-bold text-white mb-2">📰 Kelola Berita</h1>
                    <p className="text-gray-400">Buat, edit, dan kelola artikel Anda dengan mudah</p>
                </div>

                {/* Notification - Show when coming from Kategori */}
                {location.state?.selectedCategory && location.state?.categoryName && (
                    <div className="bg-green-900 bg-opacity-30 border border-green-600 rounded-lg p-4 flex items-start gap-3">
                        <span className="text-2xl">✅</span>
                        <div className="flex-1">
                            <p className="text-green-200 font-semibold mb-1">
                                Siap menulis artikel untuk kategori: <strong>{location.state.categoryName}</strong>
                            </p>
                            <p className="text-green-300 text-sm">
                                💡 Alur Kerja: Tulis artikel → Kelola di Berita (halaman ini) → Upload media → Kirim ke admin
                            </p>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="flex gap-4 flex-wrap">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <input
                            type="text"
                            placeholder="🔍 Cari berita..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-2 bg-[#1E293B] border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
                        >
                            Cari
                        </button>
                    </form>
                    <button
                        onClick={() => {
                            setEditingNews(null);
                            setFormData({
                                title: "",
                                excerpt: "",
                                body: "",
                                cover: null,
                            });
                            setShowModal(true);
                        }}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition"
                    >
                        ➕ Buat Berita Baru
                    </button>
                </div>

                {/* News List */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">⏳ Memuat berita...</p>
                    </div>
                ) : newsList.length === 0 ? (
                    <div className="bg-[#1E293B] rounded-lg p-12 text-center border border-gray-700">
                        <p className="text-gray-400 text-lg">
                            📭 Anda belum membuat berita apapun
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {newsList.map((news) => (
                            <div
                                key={news.id}
                                className="bg-[#1E293B] rounded-lg overflow-hidden border border-gray-700 hover:border-blue-600 transition"
                            >
                                {news.cover_url && (
                                    <img
                                        src={news.cover_url}
                                        alt={news.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        {news.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-3">
                                        {news.excerpt ||
                                            news.body.substring(0, 100) + "..."}
                                    </p>
                                    <div className="flex justify-between items-center mb-3">
                                        <span
                                            className={`text-xs px-2 py-1 rounded ${
                                                news.is_published
                                                    ? "bg-green-900 text-green-200"
                                                    : "bg-yellow-900 text-yellow-200"
                                            }`}
                                        >
                                            {news.is_published
                                                ? "✅ Dipublikasikan"
                                                : "📝 Draft"}
                                        </span>
                                        <small className="text-gray-500">
                                            {new Date(
                                                news.updated_at
                                            ).toLocaleDateString("id-ID")}
                                        </small>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(news)}
                                            className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteNews(news.id)
                                            }
                                            className="flex-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
                                        >
                                            🗑️ Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-4 items-center">
                        {currentPage > 1 && (
                            <button
                                onClick={() =>
                                    fetchNews(currentPage - 1, searchQuery)
                                }
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                            >
                                ← Sebelumnya
                            </button>
                        )}
                        <span className="text-gray-400">
                            Halaman {currentPage} dari {totalPages}
                        </span>
                        {currentPage < totalPages && (
                            <button
                                onClick={() =>
                                    fetchNews(currentPage + 1, searchQuery)
                                }
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                            >
                                Berikutnya →
                            </button>
                        )}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={closeModal}
                    >
                        <div
                            className="bg-[#1E293B] border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-700">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingNews
                                        ? "✏️ Edit Berita"
                                        : "➕ Buat Berita Baru"}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Content */}
                            <form
                                onSubmit={
                                    editingNews
                                        ? handleUpdateNews
                                        : handleCreateNews
                                }
                                className="p-6 space-y-4"
                            >
                                <div>
                                    <label className="block text-white font-medium mb-2">
                                        Judul *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleFormChange}
                                        placeholder="Masukkan judul berita"
                                        required
                                        className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* Category Selection */}
                                <div>
                                    <label className="block text-white font-medium mb-2">
                                        Kategori *
                                    </label>
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">-- Pilih Kategori --</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">
                                        Ringkasan (Opsional)
                                    </label>
                                    <textarea
                                        name="excerpt"
                                        value={formData.excerpt}
                                        onChange={handleFormChange}
                                        placeholder="Ringkasan singkat berita"
                                        rows="2"
                                        className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">
                                        Isi Berita *
                                    </label>
                                    <textarea
                                        name="body"
                                        value={formData.body}
                                        onChange={handleFormChange}
                                        placeholder="Masukkan isi berita"
                                        rows="8"
                                        required
                                        className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2">
                                        Gambar Sampul (Opsional)
                                    </label>
                                    <input
                                        type="file"
                                        name="cover"
                                        onChange={handleFormChange}
                                        accept="image/*"
                                        className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded text-gray-400 file:bg-blue-600 file:text-white file:border-0 file:px-3 file:py-1 file:rounded cursor-pointer"
                                    />
                                    <small className="text-gray-500 block mt-1">
                                        Format: JPG, PNG, WebP | Ukuran maks: 4MB
                                    </small>
                                </div>

                                {/* Modal Actions */}
                                <div className="flex gap-4 pt-4 border-t border-gray-700">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition"
                                    >
                                        ❌ Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition"
                                    >
                                        {editingNews ? "💾 Perbarui" : "✅ Buat Berita"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedWriterRoute>
    );
};

export default WriterBerita;
