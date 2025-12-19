import React, { useState, useEffect } from "react";
import { useWriterAuth } from "../../contexts/useAuth";
import ProtectedWriterRoute from "../../components/ProtectedWriterRoute";

const WriterMedia = () => {
    const { token: writerToken } = useWriterAuth();
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState(""); // all, pending, approved, rejected
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch media
    const fetchMedia = async (page = 1, status = "") => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                per_page: 12,
                page: page,
            });
            if (status) params.append("status", status);

            const response = await fetch(
                `http://localhost:8000/api/writer/media?${params}`,
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
                setMediaList(data.data.data);
                setCurrentPage(data.data.current_page);
                setTotalPages(data.data.last_page);
            } else {
                console.error("Gagal mengambil media");
            }
        } catch (error) {
            console.error("Error fetching media:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (writerToken) {
            fetchMedia(1, statusFilter);
        }
    }, [writerToken]);

    // Handle file select
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
        } else {
            alert("Harap pilih file gambar");
            setSelectedFile(null);
        }
    };

    // Upload media
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Pilih file gambar terlebih dahulu");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch(
                "http://localhost:8000/api/writer/media/upload",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${writerToken}`,
                    },
                    body: formData,
                }
            );

            const result = await response.json();
            if (result.status) {
                alert(
                    "Media berhasil diunggah (menunggu persetujuan admin)"
                );
                setSelectedFile(null);
                document.getElementById("file-input").value = "";
                fetchMedia(1, statusFilter);
            } else {
                alert("Gagal mengunggah media: " + result.message);
            }
        } catch (error) {
            console.error("Error uploading media:", error);
            alert("Terjadi kesalahan saat mengunggah");
        } finally {
            setUploading(false);
        }
    };

    // Delete media
    const handleDeleteMedia = async (id) => {
        if (!window.confirm("Hapus media ini?")) return;

        try {
            const response = await fetch(
                `http://localhost:8000/api/writer/media/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${writerToken}`,
                    },
                }
            );

            const result = await response.json();
            if (result.status) {
                alert("Media berhasil dihapus");
                fetchMedia(currentPage, statusFilter);
            } else {
                alert("Gagal menghapus media");
            }
        } catch (error) {
            console.error("Error deleting media:", error);
            alert("Terjadi kesalahan");
        }
    };

    // Handle status filter change
    const handleStatusChange = (status) => {
        setStatusFilter(status);
        setCurrentPage(1);
        fetchMedia(1, status);
    };

    return (
        <ProtectedWriterRoute>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] rounded-lg p-6 border border-gray-700">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        🖼️ Manajemen Media
                    </h1>
                    <p className="text-gray-400">
                        Upload dan kelola gambar artikel Anda
                    </p>
                </div>

                {/* Progress Tracking Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upload Status Indicator */}
                    <div className="bg-[#1E293B] border border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4">📊 Status Upload</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Belum Upload</span>
                                <span className="px-3 py-1 bg-red-900 text-red-200 rounded text-sm">
                                    ❌ 0
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Menunggu Persetujuan</span>
                                <span className="px-3 py-1 bg-yellow-900 text-yellow-200 rounded text-sm">
                                    ⏳ 0
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Sudah Disetujui</span>
                                <span className="px-3 py-1 bg-green-900 text-green-200 rounded text-sm">
                                    ✅ {mediaList.filter(m => m.status === 'approved').length}
                                </span>
                            </div>
                            <div className="pt-3 border-t border-gray-700 mt-3">
                                <div className="w-full bg-gray-900 rounded-full h-2">
                                    <div 
                                        className="bg-green-600 h-2 rounded-full transition-all"
                                        style={{ width: `${mediaList.length > 0 ? (mediaList.filter(m => m.status === 'approved').length / mediaList.length) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {mediaList.filter(m => m.status === 'approved').length} / {mediaList.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Article Categories Progress */}
                    <div className="lg:col-span-2 bg-[#1E293B] border border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4">📋 Kategori & Progress Artikel</h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                                <div>
                                    <p className="text-white font-medium">Integritas dan Disiplin</p>
                                    <p className="text-xs text-gray-500">3 artikel, 2 dengan media</p>
                                </div>
                                <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded text-sm">
                                    67%
                                </span>
                            </div>
                            <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                                <div>
                                    <p className="text-white font-medium">Pengembangan SDM</p>
                                    <p className="text-xs text-gray-500">2 artikel, 1 dengan media</p>
                                </div>
                                <span className="px-3 py-1 bg-yellow-900 text-yellow-200 rounded text-sm">
                                    50%
                                </span>
                            </div>
                            <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                                <div>
                                    <p className="text-white font-medium">Inovasi Produk</p>
                                    <p className="text-xs text-gray-500">1 artikel, belum ada media</p>
                                </div>
                                <span className="px-3 py-1 bg-red-900 text-red-200 rounded text-sm">
                                    0%
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 italic">
                                💡 Hint: Lengkapi media untuk setiap artikel sebelum submit ke admin
                            </p>
                        </div>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="bg-[#1E293B] border border-gray-700 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        📤 Upload Gambar Baru
                    </h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-600 transition">
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <label
                                htmlFor="file-input"
                                className="cursor-pointer block"
                            >
                                <div className="text-4xl mb-2">📷</div>
                                <p className="text-white font-medium mb-1">
                                    Klik untuk memilih gambar atau seret ke sini
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Format: JPG, PNG, WebP | Maks: 5MB
                                </p>
                                {selectedFile && (
                                    <p className="text-blue-400 mt-2">
                                        ✅ {selectedFile.name}
                                    </p>
                                )}
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={!selectedFile || uploading}
                            className={`w-full px-6 py-3 rounded font-medium transition ${
                                selectedFile && !uploading
                                    ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {uploading ? "⏳ Mengunggah..." : "✅ Unggah Gambar"}
                        </button>
                    </form>
                </div>

                {/* Filter */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => handleStatusChange("")}
                        className={`px-4 py-2 rounded font-medium transition ${
                            statusFilter === ""
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                    >
                        📋 Semua
                    </button>
                    <button
                        onClick={() => handleStatusChange("pending")}
                        className={`px-4 py-2 rounded font-medium transition ${
                            statusFilter === "pending"
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                    >
                        ⏳ Menunggu Persetujuan
                    </button>
                    <button
                        onClick={() => handleStatusChange("approved")}
                        className={`px-4 py-2 rounded font-medium transition ${
                            statusFilter === "approved"
                                ? "bg-green-600 text-white"
                                : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                    >
                        ✅ Disetujui
                    </button>
                    <button
                        onClick={() => handleStatusChange("rejected")}
                        className={`px-4 py-2 rounded font-medium transition ${
                            statusFilter === "rejected"
                                ? "bg-red-600 text-white"
                                : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                    >
                        ❌ Ditolak
                    </button>
                </div>

                {/* Media Gallery */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">⏳ Memuat media...</p>
                    </div>
                ) : mediaList.length === 0 ? (
                    <div className="bg-[#1E293B] rounded-lg p-12 text-center border border-gray-700">
                        <p className="text-gray-400 text-lg">
                            📭 Belum ada media yang diunggah
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mediaList.map((media) => (
                            <div
                                key={media.id}
                                className="bg-[#1E293B] border border-gray-700 rounded-lg overflow-hidden hover:border-blue-600 transition group"
                            >
                                {/* Image */}
                                <div className="relative w-full h-48 bg-gray-900 overflow-hidden">
                                    <img
                                        src={media.url}
                                        alt={media.original_name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition"
                                    />
                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${
                                                media.status === "approved"
                                                    ? "bg-green-900 text-green-200"
                                                    : media.status === "pending"
                                                    ? "bg-yellow-900 text-yellow-200"
                                                    : "bg-red-900 text-red-200"
                                            }`}
                                        >
                                            {media.status === "approved"
                                                ? "✅ Disetujui"
                                                : media.status === "pending"
                                                ? "⏳ Menunggu"
                                                : "❌ Ditolak"}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <h4 className="text-sm font-medium text-white truncate">
                                        {media.original_name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {(media.size / 1024).toFixed(2)} KB
                                    </p>
                                    {media.notes && (
                                        <p className="text-xs text-yellow-400 mt-1 truncate">
                                            💬 {media.notes}
                                        </p>
                                    )}
                                    <small className="text-gray-600 block mt-1">
                                        {new Date(
                                            media.created_at
                                        ).toLocaleDateString("id-ID")}
                                    </small>

                                    {/* Action */}
                                    <button
                                        onClick={() => handleDeleteMedia(media.id)}
                                        className="w-full mt-2 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition"
                                    >
                                        🗑️ Hapus
                                    </button>
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
                                    fetchMedia(currentPage - 1, statusFilter)
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
                                    fetchMedia(currentPage + 1, statusFilter)
                                }
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                            >
                                Berikutnya →
                            </button>
                        )}
                    </div>
                )}
            </div>
        </ProtectedWriterRoute>
    );
};

export default WriterMedia;
