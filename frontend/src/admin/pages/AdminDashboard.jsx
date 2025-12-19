import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../../contexts/useAuth";

const AdminDashboard = () => {
    const { adminToken, adminData } = useAdminAuth();
    const [stats, setStats] = useState({
        totalNews: 0,
        publishedNews: 0,
        draftNews: 0,
        totalCategories: 0,
        totalJobs: 0,
        activeJobs: 0,
        totalInternships: 0,
        activeInternships: 0,
    });
    const [recentNews, setRecentNews] = useState([]);
    const [pendingReview, setPendingReview] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, [adminToken]);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const headers = {
                Authorization: `Bearer ${adminToken}`,
                "Content-Type": "application/json",
            };

            // Fetch semua data yang diperlukan
            const [newsRes, categoriesRes] = await Promise.all([
                fetch("http://localhost:8000/api/admin/news", { headers }),
                fetch("http://localhost:8000/api/categories", { headers }),
            ]);

            let newsData = [];
            let categoriesData = [];

            if (newsRes.ok) {
                const newsJson = await newsRes.json();
                newsData = newsJson.data?.list || newsJson.data || [];
            }

            if (categoriesRes.ok) {
                const catJson = await categoriesRes.json();
                categoriesData = catJson.data || [];
            }

            // Calculate stats
            const publishedCount = newsData.filter(n => n.is_published)?.length || 0;
            const draftCount = newsData.filter(n => !n.is_published)?.length || 0;

            setStats({
                totalNews: newsData.length || 0,
                publishedNews: publishedCount,
                draftNews: draftCount,
                totalCategories: categoriesData.length || 0,
                totalJobs: 8, // Placeholder - update when job endpoint available
                activeJobs: 5,
                totalInternships: 3,
                activeInternships: 2,
            });

            // Get recent news (last 5)
            const recent = newsData.slice(0, 5) || [];
            setRecentNews(recent);

            // Get pending review (draft news)
            const pending = newsData.filter(n => !n.is_published).slice(0, 5) || [];
            setPendingReview(pending);

            setLoading(false);
        } catch (err) {
                console.error("Error fetching dashboard data:", err);
            setError("Gagal mengambil data dashboard");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] rounded-lg p-6 border border-gray-700">
                <h1 className="text-4xl font-bold text-white mb-2">
                    📊 Dashboard Admin
                </h1>
                <p className="text-gray-400">
                    Selamat datang kembali, {adminData?.name || "Admin"}!
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">
                    {error}
                </div>
            )}

            {/* Stats Grid - 4 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Berita */}
                <div className="bg-[#1E293B] rounded-lg p-6 border border-gray-700 hover:border-blue-600 transition">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Berita</p>
                            <p className="text-3xl font-bold text-white mt-2">
                                {stats.totalNews}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                {stats.publishedNews} dipublikasikan
                            </p>
                        </div>
                        <div className="text-3xl">📰</div>
                    </div>
                </div>

                {/* Published News */}
                <div className="bg-[#1E293B] rounded-lg p-6 border border-gray-700 hover:border-green-600 transition">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Berita Terbit</p>
                            <p className="text-3xl font-bold text-green-400 mt-2">
                                {stats.publishedNews}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Sudah dipublikasikan
                            </p>
                        </div>
                        <div className="text-3xl">✅</div>
                    </div>
                </div>

                {/* Draft News */}
                <div className="bg-[#1E293B] rounded-lg p-6 border border-gray-700 hover:border-yellow-600 transition">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Menunggu Review</p>
                            <p className="text-3xl font-bold text-yellow-400 mt-2">
                                {stats.draftNews}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Draft & review
                            </p>
                        </div>
                        <div className="text-3xl">⏳</div>
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-[#1E293B] rounded-lg p-6 border border-gray-700 hover:border-purple-600 transition">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Kategori</p>
                            <p className="text-3xl font-bold text-purple-400 mt-2">
                                {stats.totalCategories}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Kategori aktif
                            </p>
                        </div>
                        <div className="text-3xl">📂</div>
                    </div>
                </div>

                {/* Jobs */}
                <div className="bg-[#1E293B] rounded-lg p-6 border border-gray-700 hover:border-orange-600 transition">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Lowongan Kerja</p>
                            <p className="text-3xl font-bold text-orange-400 mt-2">
                                {stats.totalJobs}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                {stats.activeJobs} aktif
                            </p>
                        </div>
                        <div className="text-3xl">💼</div>
                    </div>
                </div>

                {/* Internships */}
                <div className="bg-[#1E293B] rounded-lg p-6 border border-gray-700 hover:border-cyan-600 transition">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Program Magang</p>
                            <p className="text-3xl font-bold text-cyan-400 mt-2">
                                {stats.totalInternships}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                {stats.activeInternships} aktif
                            </p>
                        </div>
                        <div className="text-3xl">🎓</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6">
                {/* Berita Terbaru */}
                <div className="bg-[#1E293B] rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">📰 Berita Terbaru</h2>
                        <a
                            href="/admin-portal/berita"
                            className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                            Lihat Semua →
                        </a>
                    </div>

                    {recentNews.length > 0 ? (
                        <div className="space-y-3">
                            {recentNews.map((news) => (
                                <div
                                    key={news.id}
                                    className="p-3 bg-[#0F172A] rounded-lg border border-gray-700 hover:border-gray-600 transition"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white text-sm line-clamp-1">
                                                {news.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(
                                                    news.updated_at
                                                ).toLocaleDateString("id-ID")}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded ${
                                                news.is_published
                                                    ? "bg-green-900 text-green-200"
                                                    : "bg-yellow-900 text-yellow-200"
                                            }`}
                                        >
                                            {news.is_published
                                                ? "✅ Terbit"
                                                : "📝 Draft"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">Belum ada berita</p>
                    )}
                </div>
            </div>

            {/* Pending Review Section */}
            {pendingReview.length > 0 && (
                <div className="bg-yellow-900/10 rounded-lg p-6 border border-yellow-700">
                    <h2 className="text-xl font-bold text-yellow-200 mb-4">
                        ⏳ Berita Menunggu Review
                    </h2>
                    <p className="text-yellow-300 text-sm mb-4">
                        Ada {pendingReview.length} berita dari writer yang menunggu
                        review Anda
                    </p>
                    <a
                        href="/admin-portal/berita"
                        className="inline-block px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition"
                    >
                        Lihat Berita Menunggu →
                    </a>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
