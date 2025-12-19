import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

const InternshipDivisionManager = () => {
  const { positionSlug } = useParams();
  const navigate = useNavigate();

  // Convert slug → readable title
  const positionTitle = useMemo(() => {
    if (!positionSlug) return "";
    return positionSlug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [positionSlug]);

  const [candidates, setCandidates] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("upload"); // upload | ranking

  // ==================== HANDLERS ====================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (
      selectedFile &&
      (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv"))
    ) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Format file tidak valid. Harap unggah file CSV.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Silakan pilih file CSV terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("candidates_csv", file);
    formData.append("position", positionTitle);

    try {
      const response = await fetch(
        "/api/admin/internship-candidates/upload-csv",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Gagal mengunggah file.");
      }

      const result = await response.json();
      alert(`Berhasil mengimpor ${result.imported_count} kandidat.`);
      setView("ranking");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processSAW = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/internship-saw/process/${positionSlug}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Gagal memproses SPK SAW.");
      }

      const result = await response.json();
      setCandidates(result.data || []);
      setView("ranking");
      alert("Proses SPK SAW berhasil.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================

  return (
    <div className="space-y-6">
      {/* 🔙 BACK BUTTON (FIXED) */}
      <button
        onClick={() => navigate("/admin-portal/internship")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
      >
        <i className="ri-arrow-left-line"></i>
        Kembali ke Daftar Divisi
      </button>

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Seleksi Kandidat:{" "}
          <span className="text-orange-400">{positionTitle}</span>
        </h1>
        <p className="text-gray-400 mt-1">
          Unggah data kandidat (CSV) untuk memulai proses seleksi.
        </p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}

      {/* UPLOAD SECTION */}
      <div className="bg-[#1E293B] border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          1. Upload File Rekap Kandidat
        </h2>
        <p className="text-gray-400 mb-4">
          File CSV berisi kolom: <code>Nama, C1, C2, C3, C4, C5</code>
        </p>

        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-orange-600/20 file:text-orange-300
              hover:file:bg-orange-600/30"
          />

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700
              text-white rounded-lg font-semibold transition
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Mengunggah..." : "Upload"}
          </button>
        </div>
      </div>

      {/* PROCESS SAW */}
      <div className="bg-[#1E293B] border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          2. Proses Ranking (SPK SAW)
        </h2>
        <p className="text-gray-400 mb-4">
          Klik tombol di bawah untuk menjalankan metode Simple Additive Weighting
          (SAW).
        </p>

        <button
          onClick={processSAW}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700
            text-white rounded-lg font-semibold transition
            disabled:opacity-50"
        >
          <i className="ri-calculator-line mr-2"></i>
          Proses SPK SAW Sekarang
        </button>
      </div>

      {/* RANKING TABLE */}
      {view === "ranking" && (
        <div className="bg-[#1E293B] rounded-lg border border-gray-700 overflow-hidden">
          <h2 className="text-xl font-semibold text-white p-6 border-b border-gray-700">
            <i className="ri-trophy-line mr-2 text-yellow-400"></i>
            Hasil Ranking Kandidat
          </h2>

          {candidates.length === 0 ? (
            <p className="text-gray-400 text-center p-8">
              Data ranking belum tersedia.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0F172A]">
                  <tr>
                    <th className="px-6 py-3 text-left text-white">Rank</th>
                    <th className="px-6 py-3 text-left text-white">
                      Nama Kandidat
                    </th>
                    <th className="px-6 py-3 text-left text-white">
                      Nilai Akhir
                    </th>
                    <th className="px-6 py-3 text-left text-white">
                      Rekomendasi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                  {candidates.map((c, i) => (
                    <tr key={c.id} className="hover:bg-[#0F172A]/50">
                      <td className="px-6 py-4 text-white font-bold">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4 text-white">{c.nama}</td>
                      <td className="px-6 py-4 text-orange-400 font-semibold">
                        {Number(c.final_score).toFixed(4)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            i < 3
                              ? "bg-green-900/30 text-green-400"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {i < 3
                            ? "Direkomendasikan"
                            : "Dipertimbangkan"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InternshipDivisionManager;
