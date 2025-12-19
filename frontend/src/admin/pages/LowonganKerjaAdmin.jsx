import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../../contexts/useAuth";

const LowonganKerjaAdmin = () => {
    const { token: adminToken } = useAdminAuth();
    const [lowongan, setLowongan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salary_min: "",
        salary_max: "",
        is_active: true,
    });

    const headers = {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
    };

    useEffect(() => {
        fetchLowongan();
    }, [adminToken]);

    const fetchLowongan = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                "http://localhost:8000/api/admin/job-works",
                { headers }
            );
            if (!response.ok) throw new Error("Gagal mengambil lowongan");

            const data = await response.json();
            setLowongan(data.data?.list || []);
        } catch (err) {
            console.error("Error fetching lowongan:", err);
            setError("Gagal mengambil data lowongan kerja");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        setFormData({
            title: "",
            description: "",
            requirements: "",
            location: "",
            salary_min: "",
            salary_max: "",
            is_active: true,
        });
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({
            title: item.title || "",
            description: item.description || "",
            requirements: item.requirements || "",
            location: item.location || "",
            salary_min: item.salary_min || "",
            salary_max: item.salary_max || "",
            is_active: item.is_active || true,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus lowongan ini?"))
            return;

        try {
            const response = await fetch(
                `http://localhost:8000/api/admin/job-works/${id}`,
                { method: "DELETE", headers }
            );

            if (!response.ok) throw new Error("Gagal menghapus lowongan");

            setLowongan(lowongan.filter((l) => l.id !== id));
        } catch (err) {
            alert("Gagal menghapus lowongan: " + err.message);
        }
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            alert("Judul lowongan tidak boleh kosong");
            return;
        }

        setSubmitting(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId
                ? `http://localhost:8000/api/admin/job-works/${editingId}`
                : "http://localhost:8000/api/admin/job-works";

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Gagal menyimpan lowongan");

            const result = await response.json();

            if (editingId) {
                setLowongan(
                    lowongan.map((l) => (l.id === editingId ? result.data : l))
                );
            } else {
                setLowongan([result.data, ...lowongan]);
            }

            setShowModal(false);
        } catch (err) {
            alert("Gagal menyimpan lowongan: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Filter lowongan berdasarkan search
    const filteredLowongan = lowongan.filter((item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-3xl font-bold text-white">
                        💼 Kelola Lowongan Kerja
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Atur lowongan pekerjaan dan lihat lamaran masuk
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium"
                >
                    <i className="ri-add-line text-lg"></i>
                    Tambah Lowongan
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
                placeholder="Cari lowongan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-[#1E293B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />

            {/* Lowongan List */}
            <div className="bg-[#1E293B] rounded-lg border border-gray-700 overflow-hidden">
                {filteredLowongan.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <i className="ri-briefcase-line text-4xl mb-3 opacity-50"></i>
                        <p>
                            {lowongan.length === 0
                                ? "Belum ada lowongan kerja."
                                : "Tidak ada lowongan yang cocok"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#0F172A] border-b border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        Posisi
                                    </th>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        Lokasi
                                    </th>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        Gaji
                                    </th>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-center text-white font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredLowongan.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-[#0F172A]/50 transition"
                                    >
                                        <td className="px-6 py-4 text-white font-medium">
                                            {item.title}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {item.location || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {item.salary_min && item.salary_max
                                                ? `${item.salary_min} - ${item.salary_max}`
                                                : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    item.is_active
                                                        ? "bg-green-900/30 text-green-400"
                                                        : "bg-red-900/30 text-red-400"
                                                }`}
                                            >
                                                {item.is_active
                                                    ? "✅ Aktif"
                                                    : "❌ Nonaktif"}
                                            </span>
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
                    <div className="bg-[#1E293B] rounded-lg border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {editingId
                                ? "✏️ Edit Lowongan"
                                : "📝 Tambah Lowongan"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Judul Posisi <span className="text-red-400">*</span>
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
                                    className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    placeholder="Masukkan judul posisi"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Lokasi
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                location: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="Cth: Jakarta"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Gaji Terendah
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.salary_min}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                salary_min: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        placeholder="Cth: 5000000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Gaji Tertinggi
                                </label>
                                <input
                                    type="number"
                                    value={formData.salary_max}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            salary_max: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    placeholder="Cth: 10000000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Deskripsi Pekerjaan
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 h-24 resize-none"
                                    placeholder="Jelaskan deskripsi pekerjaan"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Persyaratan
                                </label>
                                <textarea
                                    value={formData.requirements}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            requirements: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 h-24 resize-none"
                                    placeholder="Tuliskan persyaratan (minimal, pengalaman, dll)"
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            is_active: e.target.checked,
                                        })
                                    }
                                    className="rounded border-gray-700"
                                />
                                <label
                                    htmlFor="is_active"
                                    className="text-sm font-medium text-gray-300"
                                >
                                    Lowongan aktif
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
                                onClick={handleSave}
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
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

export default LowonganKerjaAdmin;
