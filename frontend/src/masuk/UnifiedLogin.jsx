import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "../contexts/useAuth";
import { useWriterAuth } from "../contexts/useAuth";

/**
 * UNIFIED LOGIN PAGE
 * Single entry point for BOTH admin and writer
 * Auto-detects role from backend response
 * Completely isolated state management
 */
const UnifiedLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login: loginAdmin } = useAdminAuth();
  const { login: loginWriter } = useWriterAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // ============================================================
      // STEP 1: TRY ADMIN LOGIN FIRST
      // ============================================================
      console.log("🔐 [UnifiedLogin] Attempting admin login...");
      try {
        const adminRes = await axios.post(
          "http://127.0.0.1:8000/api/admin/login",
          { email, password },
          { timeout: 5000 }
        );

        if (adminRes.data.status && adminRes.data.admin) {
          const admin = adminRes.data.admin;
          const token = adminRes.data.token;

          console.log("✅ [UnifiedLogin] Admin login SUCCESS:", {
            role: admin.role,
            email: admin.email,
          });

          // Save to localStorage & context immediately
          loginAdmin(token, admin);

          // Verify save
          const saved = localStorage.getItem("adminData");
          console.log("💾 [UnifiedLogin] Admin data saved to localStorage:", !!saved);

          setSuccess("Login admin berhasil! Mengarahkan...");

          // Redirect to admin portal
          setTimeout(() => {
            navigate("/admin-portal", { replace: true });
          }, 600);
          return;
        }
      } catch (adminErr) {
        console.log("ℹ️ [UnifiedLogin] Admin login failed:", adminErr.message);
      }

      // ============================================================
      // STEP 2: TRY WRITER LOGIN
      // ============================================================
      console.log("🔐 [UnifiedLogin] Attempting writer login...");
      try {
        const writerRes = await axios.post(
          "http://127.0.0.1:8000/api/writer/login",
          { email, password },
          { timeout: 5000 }
        );

        if (writerRes.data.status && writerRes.data.writer) {
          const writer = writerRes.data.writer;
          const token = writerRes.data.token;

          console.log("✅ [UnifiedLogin] Writer login SUCCESS:", {
            role: writer.role,
            email: writer.email,
          });

          // Save to localStorage & context immediately
          loginWriter(token, writer);

          // Verify save
          const saved = localStorage.getItem("writerData");
          console.log("💾 [UnifiedLogin] Writer data saved to localStorage:", !!saved);

          setSuccess("Login penulis berhasil! Mengarahkan...");

          // Redirect to writer portal
          setTimeout(() => {
            navigate("/writer-portal", { replace: true });
          }, 600);
          return;
        }
      } catch (writerErr) {
        console.log("ℹ️ [UnifiedLogin] Writer login failed:", writerErr.message);
      }

      // ============================================================
      // STEP 3: BOTH FAILED - SHOW ERROR
      // ============================================================
      setError("Email atau password salah. Cek kembali kredensial Anda.");
      console.log("❌ [UnifiedLogin] Both admin and writer login failed");
    } catch (err) {
      console.error("❌ [UnifiedLogin] Unexpected error:", err);
      setError("Terjadi kesalahan saat login. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111827]">
      <div className="p-8 rounded-lg shadow-lg w-[350px] bg-[#1E293B] border border-gray-700">
        <h1 className="text-[28px] font-bold mb-2 text-center text-white">
          Login
        </h1>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Admin atau Penulis
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-3 bg-red-900/20 p-3 rounded border border-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-sm mb-3 bg-green-900/20 p-3 rounded border border-green-700">
            {success}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label className="input validator mb-1 bg-[#0F172A] border-gray-700">
              <svg
                className="h-[1em] opacity-50 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                type="email"
                placeholder="email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0F172A] text-white placeholder-gray-500 outline-none w-full"
              />
            </label>
          </div>

          {/* Password */}
          <div>
            <label className="input validator mb-1 bg-[#0F172A] border-gray-700">
              <svg
                className="h-[1em] opacity-50 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input
                type="password"
                placeholder="Password"
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0F172A] text-white placeholder-gray-500 outline-none w-full"
              />
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2 rounded transition cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Loading...
              </span>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          Status: <span className="text-yellow-400">Automatic role detection</span>
        </p>

        <p className="text-center text-gray-400 text-sm mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UnifiedLogin;
