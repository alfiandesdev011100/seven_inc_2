import React from "react";
import { useWriterAuth } from "../../contexts/useAuth";

const WriterDashboard = () => {
    const { user } = useWriterAuth();

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Selamat datang, {user?.name}!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#1E293B] rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Berita</p>
                            <p className="text-2xl font-bold text-white">0</p>
                        </div>
                        <i className="ri-file-text-line text-2xl text-blue-500"></i>
                    </div>
                </div>

                <div className="bg-[#1E293B] rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Draft</p>
                            <p className="text-2xl font-bold text-white">0</p>
                        </div>
                        <i className="ri-edit-line text-2xl text-yellow-500"></i>
                    </div>
                </div>

                <div className="bg-[#1E293B] rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Review</p>
                            <p className="text-2xl font-bold text-white">0</p>
                        </div>
                        <i className="ri-eye-line text-2xl text-orange-500"></i>
                    </div>
                </div>

                <div className="bg-[#1E293B] rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Approved</p>
                            <p className="text-2xl font-bold text-white">0</p>
                        </div>
                        <i className="ri-check-line text-2xl text-green-500"></i>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1E293B] rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                        href="/writer/berita/create"
                        className="block p-4 bg-[#0F172A] rounded-lg hover:bg-[#1E293B] transition border border-gray-700"
                    >
                        <i className="ri-add-circle-line text-2xl text-blue-500 mb-2"></i>
                        <p className="text-white font-semibold">Buat Berita Baru</p>
                        <p className="text-gray-400 text-sm">Tulis artikel baru</p>
                    </a>

                    <a
                        href="/writer/media"
                        className="block p-4 bg-[#0F172A] rounded-lg hover:bg-[#1E293B] transition border border-gray-700"
                    >
                        <i className="ri-image-add-line text-2xl text-green-500 mb-2"></i>
                        <p className="text-white font-semibold">Upload Media</p>
                        <p className="text-gray-400 text-sm">Kelola gambar & file</p>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default WriterDashboard;
