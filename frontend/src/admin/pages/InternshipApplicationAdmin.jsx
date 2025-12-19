import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../../contexts/useAuth";

const InternshipApplicationAdmin = () => {
    const { token: adminToken } = useAdminAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedApp, setSelectedApp] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [stats, setStats] = useState(null);
    const [positions, setPositions] = useState([]);

    const positions_list = [
        "Administrasi", "Animasi", "Content Planner", "Content Writer",
        "Desain Grafis", "Digital Market", "Host / Presenter", "Human Resource",
        "Las", "Marketing & Sales", "Public Relation", "Photographer Videographer",
        "Programmer", "Project Manager", "Social Media Specialist", "TikTok Creator",
        "UI / UX Designer", "Voice Over Talent"
    ];

    const headers = {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
    };

    useEffect(() => {
        fetchApplications();
    }, [adminToken, selectedPosition, selectedStatus]);

    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            let url = "/api/admin/internship-applications";
            const params = new URLSearchParams();

            if (selectedPosition) params.append("position", selectedPosition);
            if (selectedStatus) params.append("status", selectedStatus);

            if (params.toString()) {
                url += "?" + params.toString();
            }

            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error("Gagal mengambil data aplikasi");

            const data = await response.json();
            setApplications(data.data?.applications?.data || []);
            setStats(data.data?.stats);
        } catch (err) {
            console.error("Error fetching applications:", err);
            setError("Gagal mengambil data aplikasi internship");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (appId, newStatus) => {
        try {
            const response = await fetch(
                `/api/admin/internship-applications/${appId}`,
                {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            if (!response.ok) throw new Error("Gagal mengubah status");

            // Update local state
            setApplications(
                applications.map((app) =>
                    app.id === appId ? { ...app, status: newStatus } : app
                )
            );

            if (selectedApp?.id === appId) {
                setSelectedApp({ ...selectedApp, status: newStatus });
            }

            fetchApplications();
        } catch (err) {
            alert("Gagal mengubah status: " + err.message);
        }
    };

    const handleDelete = async (appId) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus aplikasi ini?"))
            return;

        try {
            const response = await fetch(
                `/api/admin/internship-applications/${appId}`,
                { method: "DELETE", headers }
            );

            if (!response.ok) throw new Error("Gagal menghapus aplikasi");

            setApplications(applications.filter((app) => app.id !== appId));
            setShowDetail(false);
            fetchApplications();
        } catch (err) {
            alert("Gagal menghapus aplikasi: " + err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-900/30 text-yellow-400";
            case "reviewed":
                return "bg-blue-900/30 text-blue-400";
            case "accepted":
                return "bg-green-900/30 text-green-400";
            case "rejected":
                return "bg-red-900/30 text-red-400";
            default:
                return "bg-gray-900/30 text-gray-400";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "pending":
                return "⏳ Pending";
            case "reviewed":
                return "👀 Ditinjau";
            case "accepted":
                return "✅ Diterima";
            case "rejected":
                return "❌ Ditolak";
            default:
                return status;
        }
    };

    const filteredApplications = applications.filter((app) =>
        app.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.nim?.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">📋 Aplikasi Internship</h1>
                <p className="text-gray-400 mt-1">Kelola semua aplikasi pendaftaran magang</p>
            </div>

            {/* Statistics */}
            {stats && (
                <div className="grid grid-cols-5 gap-4">
                    <div className="bg-[#1E293B] border border-gray-700 rounded-lg p-4">
                        <p className="text-gray-400 text-sm">Total</p>
                        <p className="text-white text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-[#1E293B] border border-yellow-700/50 rounded-lg p-4">
                        <p className="text-yellow-400 text-sm">Pending</p>
                        <p className="text-yellow-400 text-2xl font-bold">{stats.pending}</p>
                    </div>
                    <div className="bg-[#1E293B] border border-blue-700/50 rounded-lg p-4">
                        <p className="text-blue-400 text-sm">Ditinjau</p>
                        <p className="text-blue-400 text-2xl font-bold">{stats.reviewed}</p>
                    </div>
                    <div className="bg-[#1E293B] border border-green-700/50 rounded-lg p-4">
                        <p className="text-green-400 text-sm">Diterima</p>
                        <p className="text-green-400 text-2xl font-bold">{stats.accepted}</p>
                    </div>
                    <div className="bg-[#1E293B] border border-red-700/50 rounded-lg p-4">
                        <p className="text-red-400 text-sm">Ditolak</p>
                        <p className="text-red-400 text-2xl font-bold">{stats.rejected}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cari Nama / Email / NIM
                    </label>
                    <input
                        type="text"
                        placeholder="..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Filter Posisi
                    </label>
                    <select
                        value={selectedPosition}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                        className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                        <option value="">-- Semua Posisi --</option>
                        {positions_list.map((pos) => (
                            <option key={pos} value={pos}>
                                {pos}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Filter Status
                    </label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-4 py-2 bg-[#0F172A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                        <option value="">-- Semua Status --</option>
                        <option value="pending">⏳ Pending</option>
                        <option value="reviewed">👀 Ditinjau</option>
                        <option value="accepted">✅ Diterima</option>
                        <option value="rejected">❌ Ditolak</option>
                    </select>
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-[#1E293B] rounded-lg border border-gray-700 overflow-hidden">
                {filteredApplications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <i className="ri-inbox-line text-4xl mb-3 opacity-50"></i>
                        <p>
                            {applications.length === 0
                                ? "Belum ada aplikasi internship."
                                : "Tidak ada aplikasi yang cocok"}
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
                                        Posisi
                                    </th>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        No HP
                                    </th>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-white font-medium">
                                        Tgl Daftar
                                    </th>
                                    <th className="px-6 py-3 text-center text-white font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredApplications.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="hover:bg-[#0F172A]/50 transition"
                                    >
                                        <td className="px-6 py-4 text-white font-medium">
                                            {app.nama_lengkap}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {app.program_magang_pilihan}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {app.email}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {app.no_hp}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                                    app.status
                                                )}`}
                                            >
                                                {getStatusLabel(app.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(app.created_at).toLocaleDateString(
                                                "id-ID"
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedApp(app);
                                                    setShowDetail(true);
                                                }}
                                                className="text-blue-400 hover:text-blue-300 transition"
                                            >
                                                <i className="ri-eye-line"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(app.id)}
                                                className="text-red-400 hover:text-red-300 transition"
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

            {/* Detail Modal */}
            {showDetail && selectedApp && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1E293B] rounded-lg border border-gray-700 p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {selectedApp.nama_lengkap}
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">
                                    Posisi: {selectedApp.program_magang_pilihan}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDetail(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Status Update */}
                        <div className="mb-6 p-4 bg-[#0F172A] rounded-lg border border-gray-700">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Update Status
                            </label>
                            <select
                                value={selectedApp.status}
                                onChange={(e) =>
                                    handleStatusChange(selectedApp.id, e.target.value)
                                }
                                className="w-full px-4 py-2 bg-[#1E293B] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                            >
                                <option value="pending">⏳ Pending</option>
                                <option value="reviewed">👀 Ditinjau</option>
                                <option value="accepted">✅ Diterima</option>
                                <option value="rejected">❌ Ditolak</option>
                            </select>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-4 mb-6">
                            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                                Informasi Dasar
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">NIM</p>
                                    <p className="text-white">{selectedApp.nim}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Email</p>
                                    <p className="text-white">{selectedApp.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">No HP</p>
                                    <p className="text-white">{selectedApp.no_hp}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Tahun Lahir</p>
                                    <p className="text-white">{selectedApp.tahun_lahir}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Jenis Kelamin</p>
                                    <p className="text-white">{selectedApp.jenis_kelamin}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Asal Sekolah</p>
                                    <p className="text-white">{selectedApp.asal_sekolah}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Program Studi</p>
                                    <p className="text-white">{selectedApp.program_studi}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Fakultas</p>
                                    <p className="text-white">{selectedApp.fakultas}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Kota</p>
                                    <p className="text-white">{selectedApp.kota}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Status Saat Ini</p>
                                    <p className="text-white">{selectedApp.status_saat_ini}</p>
                                </div>
                            </div>
                        </div>

                        {/* Internship Details */}
                        <div className="space-y-4 mb-6">
                            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                                Detail Magang
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Jenis Magang</p>
                                    <p className="text-white">{selectedApp.jenis_magang}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Sistem Magang</p>
                                    <p className="text-white">{selectedApp.sistem_magang}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Tanggal Mulai</p>
                                    <p className="text-white">
                                        {new Date(
                                            selectedApp.tanggal_mulai
                                        ).toLocaleDateString("id-ID")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Durasi</p>
                                    <p className="text-white">{selectedApp.durasi}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Bisa Baca English</p>
                                    <p className="text-white">{selectedApp.bisa_baca_english}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Tahu Dari</p>
                                    <p className="text-white">{selectedApp.tahu_dari}</p>
                                </div>
                            </div>
                        </div>

                        {/* Alasan Magang */}
                        <div className="space-y-4 mb-6">
                            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                                Alasan & Kegiatan
                            </h3>
                            <div>
                                <p className="text-gray-400 text-sm mb-2">Alasan Magang</p>
                                <p className="text-white bg-[#0F172A] p-3 rounded">
                                    {selectedApp.alasan_magang}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-2">Kegiatan Lain</p>
                                <p className="text-white bg-[#0F172A] p-3 rounded">
                                    {selectedApp.kegiatan_lain || "-"}
                                </p>
                            </div>
                        </div>

                        {/* Position-Specific Questions */}
                        {selectedApp.software_design && (
                            <div className="space-y-4 mb-6">
                                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                                    Software Design
                                </h3>
                                <p className="text-white">{selectedApp.software_design}</p>
                            </div>
                        )}

                        {selectedApp.software_video && (
                            <div className="space-y-4 mb-6">
                                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                                    Software Video
                                </h3>
                                <p className="text-white">{selectedApp.software_video}</p>
                            </div>
                        )}

                        {selectedApp.bahasa_pemrograman && (
                            <div className="space-y-4 mb-6">
                                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                                    Bahasa Pemrograman
                                </h3>
                                <p className="text-white">{selectedApp.bahasa_pemrograman}</p>
                            </div>
                        )}

                        {/* Files */}
                        <div className="space-y-4 mb-6">
                            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                                File Uploads
                            </h3>
                            {selectedApp.cv_file && (
                                <div>
                                    <p className="text-gray-400 text-sm mb-2">CV</p>
                                    <a
                                        href={`/storage/${selectedApp.cv_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-orange-400 hover:text-orange-300 underline"
                                    >
                                        <i className="ri-file-pdf-line"></i> Download CV
                                    </a>
                                </div>
                            )}
                            {selectedApp.ktp_file && (
                                <div>
                                    <p className="text-gray-400 text-sm mb-2">KTP/KTM</p>
                                    <a
                                        href={`/storage/${selectedApp.ktp_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-orange-400 hover:text-orange-300 underline"
                                    >
                                        <i className="ri-file-pdf-line"></i> Download KTP/KTM
                                    </a>
                                </div>
                            )}
                            {selectedApp.portfolio_files &&
                                selectedApp.portfolio_files.length > 0 && (
                                    <div>
                                        <p className="text-gray-400 text-sm mb-2">Portfolio</p>
                                        <div className="space-y-1">
                                            {selectedApp.portfolio_files.map((file, idx) => (
                                                <a
                                                    key={idx}
                                                    href={`/storage/${file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-orange-400 hover:text-orange-300 underline block"
                                                >
                                                    <i className="ri-file-line"></i> File {idx + 1}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4 mb-6">
                            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                                Informasi Kontak
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">No HP Wali</p>
                                    <p className="text-white">{selectedApp.no_hp_wali}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Social Media</p>
                                    <p className="text-white">{selectedApp.social_media}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Status Berkeluarga</p>
                                    <p className="text-white">
                                        {selectedApp.sudah_berkeluarga}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Butuh Info Kost</p>
                                    <p className="text-white">{selectedApp.butuh_info_kost}</p>
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDetail(false)}
                                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(selectedApp.id);
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                            >
                                <i className="ri-delete-line"></i> Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternshipApplicationAdmin;
