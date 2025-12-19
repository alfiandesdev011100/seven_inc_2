import React from "react";
import { useNavigate } from "react-router-dom";

const InternshipApplicationManager = () => {
    const navigate = useNavigate();

    const positions_list = [
        "Administrasi", "Animasi", "Content Planner", "Content Writer",
        "Desain Grafis", "Digital Market", "Host / Presenter", "Human Resource",
        "Las", "Marketing & Sales", "Public Relation", "Photographer Videographer",
        "Programmer", "Project Manager", "Social Media Specialist", "TikTok Creator",
        "UI / UX Designer", "Voice Over Talent"
    ];

    const handleManageClick = (position) => {
        // Mengubah nama posisi menjadi format URL-friendly (slug)
        const slug = position
            .toLowerCase()
            .replace(/ \/ /g, "-")
            .replace(/ & /g, "-")
            .replace(/ /g, "-");

        // Gunakan rute baru di dalam admin-portal
        navigate(`/admin-portal/internship/applications/${slug}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">📋 Seleksi Kandidat Internship</h1>
                <p className="text-gray-400 mt-1">Pilih divisi untuk mengelola kandidat dan menjalankan proses seleksi SPK.</p>
            </div>

            {/* Position Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {positions_list.map((position) => (
                    <div key={position} className="bg-[#1E293B] border border-gray-700 rounded-lg p-6 flex flex-col justify-between hover:border-orange-500 transition-all duration-300 group">
                        <div>
                            <i className="ri-briefcase-4-line text-3xl text-orange-400 mb-4"></i>
                            <h2 className="text-xl font-bold text-white mb-2">{position}</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Kelola data kandidat dan lihat hasil ranking untuk posisi ini.
                            </p>
                        </div>
                        <button
                            onClick={() => handleManageClick(position)}
                            className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition"
                        >
                            Kelola Aplikasi
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InternshipApplicationManager;
