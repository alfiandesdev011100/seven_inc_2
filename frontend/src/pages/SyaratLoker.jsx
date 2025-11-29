import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import Footer from "../components/Footer";
import Container from "../components/Container";

const SyaratLoker = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const job = location.state?.job;
    const currentPage = location.state?.currentPage || 1;

    const from = location.state?.from || "/lowongan-kerja";
    const handleBack = () => {
        if (from === "/lowongan-full") {
            navigate("/lowongan-full", { state: { currentPage } });
        } else {
            navigate("/lowongan-kerja");
        }
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    return (
        <Layout>
            <div className="w-full mx-auto pt-[120px] text-black px-4">
                <Container>
                    {/* 🔹 Back to List */}
                    <div
                        onClick={handleBack}
                        className="flex items-center gap-2 mb-3 cursor-pointer group transition-all duration-300"
                    >
                        <i className="ri-arrow-left-long-line text-[27px] transition-all duration-300 group-hover:text-[#DC3933]"></i>
                        <span className="text-[17px] transition-all duration-300 group-hover:text-[#DC3933]">Back to List</span>
                    </div>

                    {/* 🔹 Judul + Perusahaan */}
                    <div>
                        <h1 className="text-[24px] font-bold">{job?.title}</h1>
                        <p className="text-[17px] mt-[14px]">{job?.company}</p>
                    </div>

                    {/* 🔹 Border Line */}
                    <div className="border-b-2 border-gray-300 my-4"></div>

                    {/* 🔹 3 Konten Icon + Text */}
                    <div className="flex flex-wrap justify-between items-center w-full text-[12px]">
                        <div className="flex items-center gap-2">
                            <i className="ri-briefcase-4-line text-[24px]"></i>
                            <span>{job?.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="ri-map-pin-line text-[24px]"></i>
                            <span>{job?.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="ri-time-line text-[24px]"></i>
                            <span>Close Date: {job?.closeDate}</span>
                        </div>
                    </div>

                    {/* 🔹 Deskripsi */}
                    <div className="mt-10 w-full">
                        <p className="text-[16px] leading-relaxed">
                            Bertanggung jawab dalam mengelola administrasi kepegawaian, proses rekrutmen, pengembangan sumber daya manusia, serta memastikan implementasi kebijakan dan budaya perusahaan berjalan efektif.
                        </p>
                    </div>

                    {/* 🔹 KUALIFIKASI UMUM */}
                    <h2 className="mt-[30px] text-[20px] font-bold tracking-[0.2em]">KUALIFIKASI UMUM :</h2>

                    {/* 🔹 List Kualifikasi */}
                    <ul className="mt-[30px] list-disc list-inside text-[16px] leading-relaxed space-y-2 ml-[50px]">
                        <li>Wanita - usia 18-30 tahun (diutamakan sedang tidak kuliah).</li>
                        <li>Domisili Yogyakarta & sekitarnya.</li>
                        <li>Pendidikan terakhir minimal S1 Psikologi/Manajemen SDM.</li>
                        <li>Bersedia di kontrak minimal 1 tahun.</li>
                        <li>Ada laptop/netbook.</li>
                        <li>Siap bekerja 8 jam/hari pada pukul 08.00-17.00 WIB.</li>
                        <li>Mampu bekerja secara individu maupun tim.</li>
                    </ul>

                    {/* 🔹 KUALIFIKASI KHUSUS */}
                    <h2 className="mt-[30px] text-[20px] font-bold tracking-[0.2em]">KUALIFIKASI KHUSUS :</h2>

                    {/* 🔹 List Kualifikasi */}
                    <ul className="mt-[30px] list-disc list-inside text-[16px] leading-relaxed space-y-2 ml-[50px]">
                        <li>Bisa blog & sosmed</li>
                        <li>Mengerti dunia HRD</li>
                        <li>Paham rekrutmen-seleksi & menguasai kegiatan HRD lainnya</li>
                        <li>Disiplin, komunikatif, inisiatif, tanggung jawab dan mampu bekerjasama.</li>
                        <li>Cekatan dalam lingkungan fast paced</li>
                        <li>Kemampuan interpersonal baik</li>
                        <li>Dapat bekerja di bawah tekanan</li>
                    </ul>

                    {/* 🔹 TANGGUNG JAWAB */}
                    <h2 className="mt-[30px] text-[20px] font-bold tracking-[0.2em]">TANGGUNG JAWAB :</h2>

                    {/* 🔹 List Kualifikasi */}
                    <ul className="mt-[30px] list-disc list-inside text-[16px] leading-relaxed space-y-2 ml-[50px]">
                        <li>Rekrutmen & seleksi karyawan (Iklan lowker, Interview, tes serta pelaporannya).</li>
                        <li>Mengurusi keperluan administratif setiap kegiatan HRD (surat-menyurat, dll).</li>
                        <li>Mengontrol kedisiplinan karyawan (presensi, dll).</li>
                        <li>Penilaian kinerja karyawan.</li>
                    </ul>

                    {/* 🔹 BENEFIT */}
                    <h2 className="mt-[30px] text-[20px] font-bold tracking-[0.2em]">BENEFIT :</h2>

                    {/* 🔹 List Kualifikasi */}
                    <ul className="mt-[30px] list-disc list-inside text-[16px] leading-relaxed space-y-2 ml-[50px]">
                        <li>Gaji pokok & Bonus-bonus</li>
                        <li>Suasana kantor kekeluargaan</li>
                        <li>Kegiatan rutin menyenangkan (motivating competition, one-day outing, cooking day, english day, dresscode day, dll)</li>
                        <li>Pelatihan & pengembangan diri</li>
                    </ul>

                    {/* Konten AKhir */}
                    <p className="text-center text[16px] pt-[30px] italic">
                        Hanya Lamaran yang sesuai kualifikasi yang kami proses
                    </p>

                    {/* Tombol Button */}
                    <button
                        className="bg-[#DC3933] text-white rounded-full cursor-pointer mt-[35px] mb-[59px] border border-gray-200 hover:bg-white hover:text-black transition-all duration-300"
                        style={{ width: "245px", height: "63px" }}
                    >
                        Daftar Sekarang
                    </button>
                </Container>
            </div>
            <Footer />
        </Layout>
    );
};

export default SyaratLoker;