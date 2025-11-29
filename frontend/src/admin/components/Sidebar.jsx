import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
    const location = useLocation();
    const [isPekerjaanOpen, setIsPekerjaanOpen] = useState(false);
    const [isBeranda, setIsBeranda] = useState(false);

    const menuItemClasses = (path) =>
        `flex items-center p-2 rounded-lg ${location.pathname === path
            ? "bg-gray-900 text-white"
            : "text-gray-900 hover:bg-gray-100 hover:text-gray-900"
        }`;

    return (
        <aside
            id="logo-sidebar"
            className="fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r"
        >
            <div className="h-full px-3 py-4 overflow-y-auto">
                <Link to="/admin" className="flex items-center mb-5">
                    <img src="/assets/img/Logo.png" className="h-12" alt="Logo" />
                </Link>

                <ul className="space-y-2 font-medium">
                    {/* Beranda */}
                    <li>
                        <button
                            type="button"
                            onClick={() => setIsBeranda(!isBeranda)}
                            className="flex items-center w-full p-2 rounded-lg text-gray-900 hover:bg-gray-100"
                        >
                            <i className="ri-dashboard-line text-[20px]" />
                            <span className="ms-3 flex-1 text-left">Appearance</span>
                            <i
                                className={`ri-arrow-down-s-line transition-transform ${isBeranda ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {isBeranda && (
                            <ul className="pl-8 space-y-2">
                                <li>
                                    <Link to="/admin/dashboard" className={menuItemClasses("/admin/dashboard")}>
                                        Edit Logo
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/edit-appearance" className={menuItemClasses("/admin/edit-appearance")}>
                                        Edit Hero
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    {/* Edit Profil */}
                    <li>
                        <Link to="/admin/profil" className={menuItemClasses("/admin/profil")}>
                            <i className="ri-user-settings-line text-[20px]" />
                            <span className="ms-3">Edit Profil</span>
                        </Link>
                    </li>

                    {/* Tentang Kami */}
                    <li>
                        <Link to="/admin/edit-info" className={menuItemClasses("/admin/edit-info")}>
                            <i className="ri-error-warning-line text-[20px]" />
                            <span className="ms-3">Tentang Kami</span>
                        </Link>
                    </li>

                    {/* Bisnis Kami */}
                    <li>
                        <Link to="/admin/edit-bisnis-kami" className={menuItemClasses("/admin/edit-bisnis-kami")}>
                            <i className="ri-shake-hands-line text-[20px]" />
                            <span className="ms-3">Bisnis Kami</span>
                        </Link>
                    </li>
                    {/* Berita */}
                    <li>
                        <Link to="/admin/edit-berita" className={menuItemClasses("/admin/edit-berita")}>
                            <i className="ri-news-line text-[20px]" />
                            <span className="ms-3">Berita</span>
                        </Link>
                    </li>
                    {/* Internship */}
                    <li>
                        <Link to="/admin/edit-internship" className={menuItemClasses("/admin/edit-internship")}>
                            <i class="ri-ship-line text-[20px]" />
                            <span className="ms-3">Internship</span>
                        </Link>
                    </li>
                    {/* Lowongan Pekerjaan */}
                    <li>
                        <button
                            type="button"
                            onClick={() => setIsPekerjaanOpen(!isPekerjaanOpen)}
                            className="flex items-center w-full p-2 rounded-lg text-gray-900 hover:bg-gray-100"
                        >
                            <i className="ri-briefcase-2-line text-[20px]" />
                            <span className="ms-3 flex-1 text-left">Lowongan Kerja</span>
                            <i
                                className={`ri-arrow-down-s-line transition-transform ${isPekerjaanOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {isPekerjaanOpen && (
                            <ul className="pl-8 space-y-2">
                                <li>
                                    <Link to="/admin/edit-loker" className={menuItemClasses("/admin/edit-loker")}>
                                        Konten Utama
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/edit-posisi-pekerjaan" className={menuItemClasses("/admin/edit-posisi-pekerjaan")}>
                                        Posisi Pekerjaan
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    {/* Link */}
                    <li>
                        <Link to="/admin/edit-link" className={menuItemClasses("/admin/edit-link")}>
                            <i class="ri-play-circle-fill text-[20px]"></i>
                            <span className="ms-3">Sosial Media</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;