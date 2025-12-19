import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../../contexts/useAuth";

const KategoriAdmin = () => {
    const { token: adminToken } = useAdminAuth();
    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const headers = {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
    };

    useEffect(() => {
        fetchKategori();
    }, [adminToken]);

    const fetchKategori = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:8000/api/categories", { headers });
            if (!response.ok) throw new Error("Gagal mengambil kategori");

            const data = await response.json();
            setKategori(data.data?.list || []);
        } catch (err) {
            console.error("Error fetching kategori:", err);
            setError("Gagal mengambil data kategori");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        setFormData({ name: "", description: "" });
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({
            name: item.name,
            description: item.description || "",
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

        try {
            const response = await fetch(
                `http://localhost:8000/api/categories/${id}`,
                { method: "DELETE", headers }
            );

            if (!response.ok) throw new Error("Gagal menghapus kategori");

            setKategori(kategori.filter((k) => k.id !== id));
        } catch (err) {
            alert("Gagal menghapus kategori: " + err.message);
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            alert("Nama kategori tidak boleh kosong");
            return;
        }

        setSubmitting(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId
                ? `http://localhost:8000/api/categories/${editingId}`
                : "http://localhost:8000/api/categories";

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Gagal menyimpan kategori");

            const result = await response.json();

            if (editingId) {
                setKategori(kategori.map((k) => (k.id === editingId ? result.data : k)));
            } else {
                setKategori([result.data, ...kategori]);
            }

            setShowModal(false);
        } catch (err) {
            alert("Gagal menyimpan kategori: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Filter kategori berdasarkan search
    const filteredKategori = kategori.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <h1 className="text-3xl font-bold text-white">📂 Kelola Kategori</h1>
                    <p className="text-gray-400 mt-1">
                        Atur kategori untuk berita dan artikel
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                >
                    <i className="ri-add-line text-lg"></i>
                    Tambah Kategori
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">
                    {error}
                </div>
            )}

            {/* Search */}
            <input
                type="text"
                placeholder="Cari kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-[#1E293B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />

            {/* Kategori List */}
            <div className="bg-[#1E293B] rounded-lg border border-gray-700 overflow-hidden">
                {filteredKategori.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <i className="ri-folder-line text-4xl mb-3 opacity-50"></i>
                        <p>
                            {kategori.length === 0
                                ? "Belum ada kategori. Mulai dengan tambah kategori baru."
                                : "Tidak ada kategori yang cocok"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#0F172A] border-b border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        Deskripsi
                                    </th>
                                    <th className="px-6 py-3 text-center text-white font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredKategori.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-[#0F172A]/50 transition"
                                    >
                                        <td className="px-6 py-4 text-white font-medium">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 max-w-md">
                                            {item.description || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-3">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-blue-400 hover:text-blue-300 transition"
                                                title="Edit"
                                            >
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
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
                    <div className="bg-[#1E293B] rounded-lg border border-gray-700 p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {editingId ? "✏️ Edit Kategori" : "📝 Tambah Kategori"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nama Kategori <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                                    placeholder="Masukkan nama kategori"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500 h-24 resize-none"
                                    placeholder="Masukkan deskripsi kategori"
                                ></textarea>
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
                                onClick={handleSave}
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
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

export default KategoriAdmin;