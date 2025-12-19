import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Footer from "../components/Footer";
import Container from "../components/Container";

const positions = [
    "Administrasi", "Animasi", "Content Planner", "Content Writer",
    "Desain Grafis", "Digital Market", "Host / Presenter", "Human Resource",
    "Las", "Marketing & Sales", "Public Relation", "Photographer Videographer",
    "Programmer", "Project Manager", "Social Media Specialist", "TikTok Creator",
    "UI / UX Designer", "Voice Over Talent"
];

// Position-specific questions
const positionQuestions = {
    "Desain Grafis": "Software design apa yang Anda kuasai?",
    "UI / UX Designer": "Software design apa yang Anda kuasai?",
    "Photographer Videographer": "Software editing video apa yang Anda kuasai?",
    "Programmer": "Bahasa Pemrograman apa yang Anda kuasai?",
    "Digital Market": "Materi mana yang ingin Anda praktikan?",
};

// Options for Digital Marketing
const digitalMarketingOptions = ["Organic", "Ads"];

// Options for Equipment
const equipmentOptions = ["Laptop", "Kamera DSLR"];

// Options for English level
const englishLevelOptions = ["Bisa", "Kurang Bisa", "Tidak Bisa"];

// Options for marital status
const maritalStatusOptions = ["Belum Menikah", "Sudah Menikah"];

// Options for how they found out
const sourceOptions = ["Website", "Instagram", "Twitter", "Glints", "Youtube", "Other"];

// Options for housing need
const needHousingOptions = ["YA", "TIDAK"];

// Options for current status
const currentStatusOptions = ["Masih sekolah", "Sudah lulus", "Sudah bekerja"];

// Options for internship type
const internshipTypeOptions = ["Mandiri", "Kampus"];

// Options for system type
const systemTypeOptions = ["WFO", "WFH", "Hybrid"];

const InternshipRegister = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedPositionFromState = location.state?.selectedPosition || null;

    const [selectedPosition, setSelectedPosition] = useState(selectedPositionFromState || "");
    const [step, setStep] = useState(selectedPositionFromState ? 1 : 0); // 0 = select position, 1 = fill form
    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [formData, setFormData] = useState({
        // Basic Info
        nama_lengkap: "",
        tahun_lahir: "",
        nim: "",
        email: "",
        jenis_kelamin: "",
        no_hp: "",
        asal_sekolah: "",
        program_studi: "",
        fakultas: "",
        kota: "",
        alasan_magang: "",

        // Internship Details
        jenis_magang: "",
        sistem_magang: "",
        status_saat_ini: "",
        bisa_baca_english: "",
        no_hp_dosen: "",
        program_magang_pilihan: "",

        // Position-specific
        software_design: "",
        software_video: "",
        bahasa_pemrograman: "",
        materi_digital_marketing: "",

        // Equipment
        punya_alat: "",
        alat_spesifikasi: "",

        // Dates & Info
        tanggal_mulai: "",
        durasi: "",
        tahu_dari: "",

        // Files
        cv_file: null,
        ktp_file: null,
        portfolio_files: [],

        // Additional
        kegiatan_lain: "",
        butuh_info_kost: "",
        sudah_berkeluarga: "",
        no_hp_wali: "",
        social_media: "",
        terms_agreed: false,
    });

    const [errors, setErrors] = useState({});

    // Handle position selection
    const handleSelectPosition = (position) => {
        setSelectedPosition(position);
        setStep(1);
        setFormData(prev => ({ ...prev, program_magang_pilihan: position }));
    };

    // Handle back to position selection
    const handleBackToPositions = () => {
        setStep(0);
        setSelectedPosition("");
        setFormData(prev => ({
            ...prev,
            program_magang_pilihan: "",
            software_design: "",
            software_video: "",
            bahasa_pemrograman: "",
            materi_digital_marketing: "",
        }));
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    // Handle file input changes
    const handleFileChange = (e, fileType) => {
        const { files } = e.target;
        if (fileType === 'portfolio') {
            setFormData(prev => ({
                ...prev,
                portfolio_files: Array.from(files)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [fileType]: files[0]
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.nama_lengkap.trim()) newErrors.nama_lengkap = "Nama lengkap harus diisi";
        if (!formData.tahun_lahir) newErrors.tahun_lahir = "Tahun lahir harus dipilih";
        if (!formData.nim.trim()) newErrors.nim = "NIM harus diisi";
        if (!formData.email.trim()) newErrors.email = "Email harus diisi";
        if (!formData.jenis_kelamin) newErrors.jenis_kelamin = "Jenis kelamin harus dipilih";
        if (!formData.no_hp.trim()) newErrors.no_hp = "No HP harus diisi";
        if (!formData.asal_sekolah.trim()) newErrors.asal_sekolah = "Asal sekolah harus diisi";
        if (!formData.program_studi.trim()) newErrors.program_studi = "Program studi harus diisi";
        if (!formData.fakultas.trim()) newErrors.fakultas = "Fakultas harus diisi";
        if (!formData.kota.trim()) newErrors.kota = "Kota harus diisi";
        if (!formData.alasan_magang.trim()) newErrors.alasan_magang = "Alasan magang harus diisi";
        if (!formData.jenis_magang) newErrors.jenis_magang = "Jenis magang harus dipilih";
        if (!formData.sistem_magang) newErrors.sistem_magang = "Sistem magang harus dipilih";
        if (!formData.status_saat_ini) newErrors.status_saat_ini = "Status saat ini harus dipilih";
        if (!formData.bisa_baca_english) newErrors.bisa_baca_english = "Status bahasa Inggris harus dipilih";
        if (!formData.tanggal_mulai) newErrors.tanggal_mulai = "Tanggal mulai harus diisi";
        if (!formData.durasi) newErrors.durasi = "Durasi harus diisi";
        if (!formData.tahu_dari) newErrors.tahu_dari = "Sumber informasi harus dipilih";
        if (!formData.sudah_berkeluarga) newErrors.sudah_berkeluarga = "Status berkeluarga harus dipilih";
        if (!formData.no_hp_wali.trim()) newErrors.no_hp_wali = "No HP wali harus diisi";
        if (!formData.social_media.trim()) newErrors.social_media = "Social media harus diisi";
        if (!formData.terms_agreed) newErrors.terms_agreed = "Anda harus setuju dengan syarat dan ketentuan";

        // Position-specific validations
        if (selectedPosition === "Desain Grafis" || selectedPosition === "UI / UX Designer") {
            if (!formData.software_design.trim()) newErrors.software_design = "Software design harus diisi";
        }
        if (selectedPosition === "Photographer Videographer") {
            if (!formData.software_video.trim()) newErrors.software_video = "Software video harus diisi";
        }
        if (selectedPosition === "Programmer") {
            if (!formData.bahasa_pemrograman.trim()) newErrors.bahasa_pemrograman = "Bahasa pemrograman harus diisi";
        }
        if (selectedPosition === "Digital Market") {
            if (!formData.materi_digital_marketing) newErrors.materi_digital_marketing = "Pilihan materi harus dipilih";
        }

        // File validations
        if (!formData.cv_file) newErrors.cv_file = "File CV harus diupload";
        if (!formData.ktp_file) newErrors.ktp_file = "File KTP/KTM harus diupload";
        if (formData.portfolio_files.length === 0) newErrors.portfolio_files = "File portfolio harus diupload";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const formDataToSend = new FormData();

            // Add all text fields
            Object.keys(formData).forEach(key => {
                if (!['cv_file', 'ktp_file', 'portfolio_files'].includes(key)) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Add files
            if (formData.cv_file) {
                formDataToSend.append('cv_file', formData.cv_file);
            }
            if (formData.ktp_file) {
                formDataToSend.append('ktp_file', formData.ktp_file);
            }
            formData.portfolio_files.forEach((file, index) => {
                formDataToSend.append(`portfolio_files[${index}]`, file);
            });

            const response = await fetch('/api/internship-applications', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Gagal mengirim formulir');
            }

            setSubmitSuccess(true);
            setTimeout(() => {
                navigate('/internship');
            }, 3000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors(prev => ({
                ...prev,
                submit: 'Gagal mengirim formulir. Silakan coba lagi.'
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="bg-white text-gray-800 pt-[130px] pb-24">
                <Container>
                    {/* Step 0: Position Selection */}
                    {step === 0 && (
                        <div className="max-w-[1200px] mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="uppercase tracking-[0.6em] text-gray-600 text-[20px] mb-3">Pilih Posisi</h2>
                                <h3 className="text-[36px] md:text-[40px] font-bold text-gray-900 mb-4">
                                    Pilih Posisi Internship yang Anda Minati
                                </h3>
                                <p className="text-gray-600 text-[16px] leading-relaxed">
                                    Klik salah satu posisi di bawah untuk melanjutkan ke formulir pendaftaran
                                </p>
                            </div>

                            {/* Grid 18 posisi */}
                            <div className="grid grid-cols-6 gap-6 md:gap-8">
                                {positions.map((position, index) => {
                                    const positionData = [
                                        { name: "Administrasi", image: "/assets/img/vector1.png" },
                                        { name: "Animasi", image: "/assets/img/vector2.png" },
                                        { name: "Content Planner", image: "/assets/img/vector3.png" },
                                        { name: "Content Writer", image: "/assets/img/vector4.png" },
                                        { name: "Desain Grafis", image: "/assets/img/vector5.png" },
                                        { name: "Digital Market", image: "/assets/img/vector6.png" },
                                        { name: "Host / Presenter", image: "/assets/img/vector7.png" },
                                        { name: "Human Resource", image: "/assets/img/vector8.png" },
                                        { name: "Las", image: "/assets/img/vector9.png" },
                                        { name: "Marketing & Sales", image: "/assets/img/vector10.png" },
                                        { name: "Public Relation", image: "/assets/img/vector11.png" },
                                        { name: "Photographer Videographer", image: "/assets/img/vector12.png" },
                                        { name: "Programmer", image: "/assets/img/vector13.png" },
                                        { name: "Project Manager", image: "/assets/img/vector14.png" },
                                        { name: "Social Media Specialist", image: "/assets/img/vector15.png" },
                                        { name: "TikTok Creator", image: "/assets/img/vector16.png" },
                                        { name: "UI / UX Designer", image: "/assets/img/vector17.png" },
                                        { name: "Voice Over Talent", image: "/assets/img/vector18.png" },
                                    ][index];

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleSelectPosition(position)}
                                            className="h-[160px] flex flex-col items-center justify-center bg-white rounded-lg shadow border border-gray-200 w-full group transition-all duration-300 hover:bg-red-500 cursor-pointer"
                                        >
                                            {positionData && (
                                                <>
                                                    <img
                                                        src={positionData.image}
                                                        alt={position}
                                                        className="w-12 h-12 mb-3 transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                                                    />
                                                    <p className="text-xs md:text-sm font-semibold text-gray-800 text-center px-2 transition-all duration-300 group-hover:text-white">
                                                        {position}
                                                    </p>
                                                </>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => navigate('/internship')}
                                    className="text-red-500 hover:text-red-600 underline text-[16px] font-medium"
                                >
                                    ← Kembali ke Halaman Internship
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Registration Form */}
                    {step === 1 && (
                        <div className="max-w-[900px] mx-auto">
                            {/* Notification Banner */}
                            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 font-medium text-center">
                                    Anda memasuki form internship <span className="font-bold">{selectedPosition}</span>
                                </p>
                            </div>

                            {submitSuccess && (
                                <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-700 font-medium text-center">
                                        ✓ Formulir berhasil dikirim! Silakan tunggu konfirmasi dari admin melalui WhatsApp.
                                    </p>
                                </div>
                            )}

                            {errors.submit && (
                                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 font-medium text-center">{errors.submit}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Information Section */}
                                <section>
                                    <h3 className="text-[24px] font-bold text-gray-900 mb-6 pb-2 border-b-2 border-red-500">
                                        Informasi Dasar
                                    </h3>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Nama Lengkap *</label>
                                            <input
                                                type="text"
                                                name="nama_lengkap"
                                                value={formData.nama_lengkap}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.nama_lengkap ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Masukkan nama lengkap"
                                            />
                                            {errors.nama_lengkap && <p className="text-red-500 text-sm mt-1">{errors.nama_lengkap}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Tahun Lahir *</label>
                                            <select
                                                name="tahun_lahir"
                                                value={formData.tahun_lahir}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.tahun_lahir ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">-- Pilih Tahun Lahir --</option>
                                                {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i - 15).reverse().map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                            {errors.tahun_lahir && <p className="text-red-500 text-sm mt-1">{errors.tahun_lahir}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">NIM *</label>
                                            <input
                                                type="text"
                                                name="nim"
                                                value={formData.nim}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.nim ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Masukkan NIM"
                                            />
                                            {errors.nim && <p className="text-red-500 text-sm mt-1">{errors.nim}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Masukkan email"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Jenis Kelamin *</label>
                                            <select
                                                name="jenis_kelamin"
                                                value={formData.jenis_kelamin}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.jenis_kelamin ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">-- Pilih Jenis Kelamin --</option>
                                                <option value="Laki-laki">Laki-laki</option>
                                                <option value="Perempuan">Perempuan</option>
                                            </select>
                                            {errors.jenis_kelamin && <p className="text-red-500 text-sm mt-1">{errors.jenis_kelamin}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">No HP *</label>
                                            <input
                                                type="tel"
                                                name="no_hp"
                                                value={formData.no_hp}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.no_hp ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Masukkan nomor HP"
                                            />
                                            {errors.no_hp && <p className="text-red-500 text-sm mt-1">{errors.no_hp}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Asal Sekolah/Kampus *</label>
                                            <input
                                                type="text"
                                                name="asal_sekolah"
                                                value={formData.asal_sekolah}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.asal_sekolah ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Masukkan asal sekolah/kampus"
                                            />
                                            {errors.asal_sekolah && <p className="text-red-500 text-sm mt-1">{errors.asal_sekolah}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Program Studi *</label>
                                            <input
                                                type="text"
                                                name="program_studi"
                                                value={formData.program_studi}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.program_studi ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Masukkan program studi"
                                            />
                                            {errors.program_studi && <p className="text-red-500 text-sm mt-1">{errors.program_studi}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Fakultas *</label>
                                            <input
                                                type="text"
                                                name="fakultas"
                                                value={formData.fakultas}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.fakultas ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Masukkan fakultas"
                                            />
                                            {errors.fakultas && <p className="text-red-500 text-sm mt-1">{errors.fakultas}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Kota *</label>
                                            <input
                                                type="text"
                                                name="kota"
                                                value={formData.kota}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.kota ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Masukkan kota"
                                            />
                                            {errors.kota && <p className="text-red-500 text-sm mt-1">{errors.kota}</p>}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-gray-700 font-medium mb-2">Alasan Magang *</label>
                                        <textarea
                                            name="alasan_magang"
                                            value={formData.alasan_magang}
                                            onChange={handleInputChange}
                                            rows="4"
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.alasan_magang ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Jelaskan alasan Anda mengikuti program magang ini"
                                        />
                                        {errors.alasan_magang && <p className="text-red-500 text-sm mt-1">{errors.alasan_magang}</p>}
                                    </div>
                                </section>

                                {/* Internship Details Section */}
                                <section>
                                    <h3 className="text-[24px] font-bold text-gray-900 mb-6 pb-2 border-b-2 border-red-500">
                                        Detail Magang
                                    </h3>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Jenis Magang *</label>
                                            <select
                                                name="jenis_magang"
                                                value={formData.jenis_magang}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.jenis_magang ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">-- Pilih Jenis Magang --</option>
                                                {internshipTypeOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            {errors.jenis_magang && <p className="text-red-500 text-sm mt-1">{errors.jenis_magang}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Sistem Magang *</label>
                                            <select
                                                name="sistem_magang"
                                                value={formData.sistem_magang}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.sistem_magang ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">-- Pilih Sistem Magang --</option>
                                                {systemTypeOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            {errors.sistem_magang && <p className="text-red-500 text-sm mt-1">{errors.sistem_magang}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Status Saat Ini *</label>
                                            <select
                                                name="status_saat_ini"
                                                value={formData.status_saat_ini}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.status_saat_ini ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">-- Pilih Status --</option>
                                                {currentStatusOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            {errors.status_saat_ini && <p className="text-red-500 text-sm mt-1">{errors.status_saat_ini}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Bisa Baca English *</label>
                                            <select
                                                name="bisa_baca_english"
                                                value={formData.bisa_baca_english}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.bisa_baca_english ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">-- Pilih Level --</option>
                                                {englishLevelOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            {errors.bisa_baca_english && <p className="text-red-500 text-sm mt-1">{errors.bisa_baca_english}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">No HP Dosen/Pembimbing</label>
                                            <input
                                                type="tel"
                                                name="no_hp_dosen"
                                                value={formData.no_hp_dosen}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.no_hp_dosen ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Masukkan nomor HP dosen"
                                            />
                                            {errors.no_hp_dosen && <p className="text-red-500 text-sm mt-1">{errors.no_hp_dosen}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Tanggal Mulai Magang *</label>
                                            <input
                                                type="date"
                                                name="tanggal_mulai"
                                                value={formData.tanggal_mulai}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.tanggal_mulai ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {errors.tanggal_mulai && <p className="text-red-500 text-sm mt-1">{errors.tanggal_mulai}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Durasi Magang *</label>
                                            <input
                                                type="text"
                                                name="durasi"
                                                value={formData.durasi}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.durasi ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Contoh: 3 Bulan"
                                            />
                                            {errors.durasi && <p className="text-red-500 text-sm mt-1">{errors.durasi}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Darimana Anda Tahu Tentang Program Ini? *</label>
                                            <select
                                                name="tahu_dari"
                                                value={formData.tahu_dari}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.tahu_dari ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">-- Pilih Sumber --</option>
                                                {sourceOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            {errors.tahu_dari && <p className="text-red-500 text-sm mt-1">{errors.tahu_dari}</p>}
                                        </div>
                                    </div>
                                </section>

                                {/* Position-Specific Questions Section */}
                                {(selectedPosition === "Desain Grafis" || selectedPosition === "UI / UX Designer") && (
                                    <section>
                                        <h3 className="text-[24px] font-bold text-gray-900 mb-6 pb-2 border-b-2 border-red-500">
                                            Pertanyaan Khusus {selectedPosition}
                                        </h3>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Software design apa yang Anda kuasai? *
                                            </label>
                                            <input
                                                type="text"
                                                name="software_design"
                                                value={formData.software_design}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.software_design ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Contoh: Figma, Adobe XD, Sketch, dll"
                                            />
                                            {errors.software_design && <p className="text-red-500 text-sm mt-1">{errors.software_design}</p>}
                                        </div>
                                    </section>
                                )}

                                {selectedPosition === "Photographer Videographer" && (
                                    <section>
                                        <h3 className="text-[24px] font-bold text-gray-900 mb-6 pb-2 border-b-2 border-red-500">
                                            Pertanyaan Khusus Photographer Videographer
                                        </h3>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Software editing video apa yang Anda kuasai? *
                                            </label>
                                            <input
                                                type="text"
                                                name="software_video"
                                                value={formData.software_video}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.software_video ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Contoh: Premiere Pro, Final Cut Pro, DaVinci Resolve, dll"
                                            />
                                            {errors.software_video && <p className="text-red-500 text-sm mt-1">{errors.software_video}</p>}
                                        </div>
                                    </section>
                                )}

                                {selectedPosition === "Programmer" && (
                                    <section>
                                        <h3 className="text-[24px] font-bold text-gray-900 mb-6 pb-2 border-b-2 border-red-500">
                                            Pertanyaan Khusus Programmer
                                        </h3>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Bahasa Pemrograman apa yang Anda kuasai? *
                                            </label>
                                            <input
                                                type="text"
                                                name="bahasa_pemrograman"
                                                value={formData.bahasa_pemrograman}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.bahasa_pemrograman ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Contoh: Python, JavaScript, Java, C++, dll"
                                            />
                                            {errors.bahasa_pemrograman && <p className="text-red-500 text-sm mt-1">{errors.bahasa_pemrograman}</p>}
                                        </div>
                                    </section>
                                )}

                                {selectedPosition === "Digital Market" && (
                                    <section>
                                        <h3 className="text-[24px] font-bold text-gray-900 mb-6 pb-2 border-b-2 border-red-500">
                                            Pertanyaan Khusus Digital Marketing
                                        </h3>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                Materi mana yang ingin Anda praktikan? *
                                            </label>
                                            <select
                                                name="materi_digital_marketing"
                                                value={formData.materi_digital_marketing}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.materi_digital_marketing ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">-- Pilih Materi --</option>
                                                {digitalMarketingOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            {errors.materi_digital_marketing && <p className="text-red-500 text-sm mt-1">{errors.materi_digital_marketing}</p>}
                                        </div>
                                    </section>
                                )}

                                {/* Equipment & Other Details Section */}
                                <section>
                                    <h3 className="text-[24px] font-bold text-gray-900 mb-6 pb-2 border-b-2 border-red-500">
                                        Peralatan & Detail Lainnya
                                    </h3>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Punya Alat Kerja? *</label>
                                            <select
                                                name="punya_alat"
                                                value={formData.punya_alat}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.punya_alat ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">-- Pilih --</option>
                                                {needHousingOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            {errors.punya_alat && <p className="text-red-500 text-sm mt-1">{errors.punya_alat}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Spesifikasi Alat</label>
                                            <input
                                                type="text"
                                                name="alat_spesifikasi"
                                                value={formData.alat_spesifikasi}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.alat_spesifikasi ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Contoh: Laptop (Spek: i7, 16GB RAM)"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Kegiatan Lain Selama Magang</label>
                                            <textarea
                                                name="kegiatan_lain"
                                                value={formData.kegiatan_lain}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.kegiatan_lain ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Jelaskan kegiatan lain yang akan Anda lakukan"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Butuh Info Kost? *</label>
                                            <select
                                                name="butuh_info_kost"
                                                value={formData.butuh_info_kost}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.butuh_info_kost ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">-- Pilih --</option>
                                                {needHousingOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            {errors.butuh_info_kost && <p className="text-red-500 text-sm mt-1">{errors.butuh_info_kost}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Status Berkeluarga *</label>
                                            <select
                                                name="sudah_berkeluarga"
                                                value={formData.sudah_berkeluarga}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.sudah_berkeluarga ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">-- Pilih Status --</option>
                                                {maritalStatusOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            {errors.sudah_berkeluarga && <p className="text-red-500 text-sm mt-1">{errors.sudah_berkeluarga}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">No HP Wali/Orang Tua *</label>
                                            <input
                                                type="tel"
                                                name="no_hp_wali"
                                                value={formData.no_hp_wali}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.no_hp_wali ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Masukkan nomor HP wali"
                                            />
                                            {errors.no_hp_wali && <p className="text-red-500 text-sm mt-1">{errors.no_hp_wali}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Social Media (Instagram) *</label>
                                            <input
                                                type="text"
                                                name="social_media"
                                                value={formData.social_media}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.social_media ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="@username_instagram"
                                            />
                                            {errors.social_media && <p className="text-red-500 text-sm mt-1">{errors.social_media}</p>}
                                        </div>
                                    </div>
                                </section>

                                {/* File Uploads Section */}
                                <section>
                                    <h3 className="text-[24px] font-bold text-gray-900 mb-6 pb-2 border-b-2 border-red-500">
                                        Upload Berkas
                                    </h3>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">CV (PDF, Max 10MB) *</label>
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => handleFileChange(e, 'cv_file')}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.cv_file ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {formData.cv_file && <p className="text-green-600 text-sm mt-1">✓ {formData.cv_file.name}</p>}
                                            {errors.cv_file && <p className="text-red-500 text-sm mt-1">{errors.cv_file}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">KTP/KTM (PDF, Max 10MB) *</label>
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => handleFileChange(e, 'ktp_file')}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.ktp_file ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {formData.ktp_file && <p className="text-green-600 text-sm mt-1">✓ {formData.ktp_file.name}</p>}
                                            {errors.ktp_file && <p className="text-red-500 text-sm mt-1">{errors.ktp_file}</p>}
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-gray-700 font-medium mb-2">Portfolio (Max 5 files, JPG/PDF/YouTube Link) *</label>
                                            <input
                                                type="file"
                                                multiple
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                onChange={(e) => handleFileChange(e, 'portfolio_files')}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.portfolio_files ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {formData.portfolio_files.length > 0 && (
                                                <div className="mt-2">
                                                    {formData.portfolio_files.map((file, idx) => (
                                                        <p key={idx} className="text-green-600 text-sm">✓ {file.name}</p>
                                                    ))}
                                                </div>
                                            )}
                                            {errors.portfolio_files && <p className="text-red-500 text-sm mt-1">{errors.portfolio_files}</p>}
                                        </div>
                                    </div>
                                </section>

                                {/* Terms & Conditions */}
                                <section>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="terms_agreed"
                                                checked={formData.terms_agreed}
                                                onChange={handleInputChange}
                                                className="mt-1"
                                            />
                                            <span className="text-gray-700 text-[14px]">
                                                Saya memahami bahwa program magang ini adalah program unpaid (tidak dibayar). Saya setuju dengan semua syarat dan ketentuan yang berlaku di Seven INC.
                                            </span>
                                        </label>
                                        {errors.terms_agreed && <p className="text-red-500 text-sm mt-2">{errors.terms_agreed}</p>}
                                    </div>
                                </section>

                                {/* Action Buttons */}
                                <div className="flex gap-4 justify-center mt-8">
                                    <button
                                        type="button"
                                        onClick={handleBackToPositions}
                                        className="px-8 py-3 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition"
                                    >
                                        ← Kembali ke Pilihan Posisi
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`px-8 py-3 bg-red-500 text-white rounded-lg font-medium transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
                                    >
                                        {loading ? 'Mengirim...' : 'Kirim Formulir'}
                                    </button>
                                </div>
                            </form>

                            {/* Position Selection at Bottom */}
                            <div className="mt-12 pt-8 border-t border-gray-300">
                                <h3 className="text-[20px] font-bold text-gray-900 mb-6 text-center">
                                    Atau Pilih Posisi Internship Lain
                                </h3>
                                <div className="grid grid-cols-6 gap-4">
                                    {positions.map((position, index) => {
                                        const positionData = [
                                            { name: "Administrasi", image: "/assets/img/vector1.png" },
                                            { name: "Animasi", image: "/assets/img/vector2.png" },
                                            { name: "Content Planner", image: "/assets/img/vector3.png" },
                                            { name: "Content Writer", image: "/assets/img/vector4.png" },
                                            { name: "Desain Grafis", image: "/assets/img/vector5.png" },
                                            { name: "Digital Market", image: "/assets/img/vector6.png" },
                                            { name: "Host / Presenter", image: "/assets/img/vector7.png" },
                                            { name: "Human Resource", image: "/assets/img/vector8.png" },
                                            { name: "Las", image: "/assets/img/vector9.png" },
                                            { name: "Marketing & Sales", image: "/assets/img/vector10.png" },
                                            { name: "Public Relation", image: "/assets/img/vector11.png" },
                                            { name: "Photographer Videographer", image: "/assets/img/vector12.png" },
                                            { name: "Programmer", image: "/assets/img/vector13.png" },
                                            { name: "Project Manager", image: "/assets/img/vector14.png" },
                                            { name: "Social Media Specialist", image: "/assets/img/vector15.png" },
                                            { name: "TikTok Creator", image: "/assets/img/vector16.png" },
                                            { name: "UI / UX Designer", image: "/assets/img/vector17.png" },
                                            { name: "Voice Over Talent", image: "/assets/img/vector18.png" },
                                        ][index];

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleSelectPosition(position)}
                                                className={`h-[100px] flex flex-col items-center justify-center rounded-lg shadow border transition-all duration-300 ${
                                                    selectedPosition === position
                                                        ? 'bg-red-500 border-red-500'
                                                        : 'bg-white border-gray-200 hover:bg-red-50'
                                                }`}
                                            >
                                                {positionData && (
                                                    <>
                                                        <img
                                                            src={positionData.image}
                                                            alt={position}
                                                            className={`w-8 h-8 mb-2 transition-all duration-300 ${
                                                                selectedPosition === position
                                                                    ? 'brightness-0 invert'
                                                                    : ''
                                                            }`}
                                                        />
                                                        <p className={`text-xs font-semibold text-center px-1 transition-all duration-300 ${
                                                            selectedPosition === position
                                                                ? 'text-white'
                                                                : 'text-gray-800'
                                                        }`}>
                                                            {position}
                                                        </p>
                                                    </>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </Container>
            </div>

            <Footer />
        </Layout>
    );
};

export default InternshipRegister;
