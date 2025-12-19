import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWriterAuth } from "../../contexts/useAuth";
import ProtectedWriterRoute from "../../components/ProtectedWriterRoute";

const WriterKategori = () => {
    const { token: writerToken } = useWriterAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch categories
    const fetchCategories = async () => {
        setLoading(true);
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
            } else {
                console.error("Gagal mengambil kategori");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (writerToken) {
            fetchCategories();
        }
    }, [writerToken]);

    // Handle write article for category
    const handleWriteArticle = (category) => {
        // Navigate to WriterBerita dengan state kategori
        navigate("/writer-portal/berita", { 
            state: { 
                selectedCategory: category.id,
                categoryName: category.name,
                categorySlug: category.slug,
                fromKategori: true
            } 
        });
    };

    return (
        <ProtectedWriterRoute>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] rounded-lg p-6 border border-gray-700">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        📂 Daftar Kategori
                    </h1>
                    <p className="text-gray-400">
                        Pilih kategori untuk menulis artikel. Setiap kategori memiliki tema dan topik yang spesifik.
                    </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4">
                    <p className="text-blue-200">
                        💡 <strong>Alur Kerja:</strong> Pilih kategori → Tulis artikel → Kelola di Berita → Upload media → Kirim ke admin
                    </p>
                </div>

                {/* Categories List */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400">⏳ Memuat kategori...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="bg-[#1E293B] rounded-lg p-12 text-center border border-gray-700">
                        <p className="text-gray-400 text-lg">
                            📭 Tidak ada kategori yang tersedia
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-[#1E293B] border border-gray-700 rounded-lg p-6 hover:border-blue-600 transition flex flex-col h-full"
                            >
                                {/* Category Info */}
                                <div className="flex-1 mb-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-bold text-white flex-1">
                                            {category.name}
                                        </h3>
                                        <div className="text-2xl ml-2">📌</div>
                                    </div>
                                    
                                    {category.description && (
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {category.description}
                                        </p>
                                    )}

                                    {/* Slug */}
                                    {category.slug && (
                                        <div className="pt-3 border-t border-gray-700">
                                            <small className="text-gray-500">
                                                Slug: <code className="bg-gray-900 px-2 py-1 rounded text-gray-300">{category.slug}</code>
                                            </small>
                                        </div>
                                    )}

                                    {/* Article Count */}
                                    {category.news_count !== undefined && (
                                        <div className="mt-3 text-sm text-gray-400">
                                            📄 {category.news_count} artikel
                                        </div>
                                    )}
                                </div>

                                {/* Write Button */}
                                <button
                                    onClick={() => handleWriteArticle(category)}
                                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center gap-2"
                                >
                                    <i className="ri-edit-2-line"></i>
                                    Edit/Tulis Artikel
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedWriterRoute>
    );
};

export default WriterKategori;
