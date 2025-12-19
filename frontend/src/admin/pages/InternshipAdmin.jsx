import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/useAuth";

const InternshipAdmin = () => {
  const { token: adminToken } = useAdminAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    ditinjau: 0,
    diterima: 0,
  });

  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const makeSlug = (name) =>
    name
      .toLowerCase()
      .replace(/ \/ /g, "-")
      .replace(/ & /g, "-")
      .replace(/\s+/g, "-");

  useEffect(() => {
    if (!adminToken) return;
    fetchDashboardData();
  }, [adminToken]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8000/api/admin/internship/dashboard",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data dashboard");
      }

      const result = await response.json();

      setStats(result?.data?.stats || stats);
      setDivisions(result?.data?.divisions || []);
    } catch (err) {
      console.error("❌ Dashboard error:", err);
      setError("Gagal memuat data. Pastikan API server berjalan.");
      setDivisions([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0F172A] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            🎓 Program Magang
          </h1>
          <p className="text-gray-400">
            Atur program magang dan kelola peserta
          </p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            ["Total Aplikasi", stats.total, "📊", "blue"],
            ["Menunggu Ulasan", stats.pending, "⏳", "yellow"],
            ["Sedang Ditinjau", stats.ditinjau, "👀", "orange"],
            ["Diterima", stats.diterima, "✅", "green"],
          ].map(([label, value, icon, color]) => (
            <div
              key={label}
              className={`bg-[#1E293B] border border-${color}-700/50 rounded-lg p-6`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{label}</p>
                  <p className={`text-3xl font-bold text-${color}-400`}>
                    {value}
                  </p>
                </div>
                <div className="text-4xl opacity-30">{icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Divisi */}
        <div className="bg-[#1E293B] rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              📋 Divisi / Posisi Magang
            </h2>
            <p className="text-gray-400 text-sm">
              Kelola peserta per divisi
            </p>
          </div>

          <div className="p-6">
            {divisions.length === 0 ? (
              <p className="text-center text-gray-400">
                Belum ada data divisi
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {divisions.map((division) => (
                  <div
                    key={division.id}
                    className="bg-[#0F172A] border border-gray-700 rounded-lg p-4 hover:border-blue-600 transition"
                  >
                    <div className="flex justify-between mb-3">
                      <h3 className="text-white font-semibold">
                        {division.nama}
                      </h3>
                      <span className="text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full text-sm">
                        {division.count}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/admin-portal/internship/applications/${makeSlug(
                            division.nama
                          )}`
                        )
                      }
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg text-sm hover:shadow-lg"
                    >
                      Lihat Aplikasi →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 border border-red-700 bg-red-900/20 text-red-400 p-4 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipAdmin;
