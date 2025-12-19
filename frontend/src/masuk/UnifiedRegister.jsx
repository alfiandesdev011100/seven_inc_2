import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "../contexts/useAuth";
import { useWriterAuth } from "../contexts/useAuth";

/**
 * UNIFIED REGISTER PAGE
 * Single entry point for BOTH admin and writer registration
 * User selects role and registers accordingly
 */
const UnifiedRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "writer", // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login: loginAdmin } = useAdminAuth();
  const { login: loginWriter } = useWriterAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Nama lengkap harus diisi");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email harus diisi");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Format email tidak valid");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter");
      return false;
    }
    if (formData.password !== formData.passwordConfirm) {
      setError("Password dan konfirmasi password tidak sama");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        formData.role === "writer"
          ? "http://127.0.0.1:8000/api/writer/register"
          : "http://127.0.0.1:8000/api/admin/register";

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.passwordConfirm,
      };

      // Add role for admin registration
      if (formData.role !== "writer") {
        payload.role = "admin";
      }

      console.log("📝 [UnifiedRegister] Registering as:", formData.role);

      const response = await axios.post(endpoint, payload, {
        timeout: 5000,
      });

      if (response.data.status) {
        console.log("✅ [UnifiedRegister] Registration SUCCESS");

        const isWriter = formData.role === "writer";
        const token = response.data.token;
        const user = isWriter ? response.data.writer : response.data.admin;

        // Save to localStorage & context
        if (isWriter) {
          loginWriter(token, user);
        } else {
          loginAdmin(token, user);
        }

        setSuccess("Registrasi berhasil! Mengarahkan...");

        // Redirect after 1 second
        setTimeout(() => {
          const redirectUrl = isWriter ? "/writer-portal" : "/admin-portal";
          navigate(redirectUrl, { replace: true });
        }, 1000);
      }
    } catch (err) {
      console.error("❌ [UnifiedRegister] Error:", err.response?.data || err.message);

      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        setError(firstError || "Registrasi gagal. Coba lagi.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Terjadi kesalahan saat registrasi. Coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111827]">
      <div className="p-8 rounded-lg shadow-lg w-[350px] bg-[#1E293B] border border-gray-700">
        <h1 className="text-[28px] font-bold mb-2 text-center text-white">
          Daftar
        </h1>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Buat akun baru Anda
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

        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Daftar Sebagai
            </label>
            <div className="flex gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="writer"
                  checked={formData.role === "writer"}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-300">Penulis</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-300">Admin</span>
              </label>
            </div>
          </div>

          {/* Name */}
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                required
                value={formData.name}
                onChange={handleChange}
                className="bg-[#0F172A] text-white placeholder-gray-500 outline-none w-full"
              />
            </label>
          </div>

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
                name="email"
                placeholder="email@example.com"
                required
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                placeholder="Password (min. 8 karakter)"
                minLength={8}
                required
                value={formData.password}
                onChange={handleChange}
                className="bg-[#0F172A] text-white placeholder-gray-500 outline-none w-full"
              />
            </label>
          </div>

          {/* Confirm Password */}
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
                name="passwordConfirm"
                placeholder="Konfirmasi Password"
                minLength={8}
                required
                value={formData.passwordConfirm}
                onChange={handleChange}
                className="bg-[#0F172A] text-white placeholder-gray-500 outline-none w-full"
              />
            </label>
          </div>

          {/* Register Button */}
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
              "Daftar"
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Masuk di sini
          </Link>
        </p>

        <p className="text-center text-gray-400 text-xs mt-4">
          Registrasi otomatis ke portal yang sesuai
        </p>
      </div>
    </div>
  );
};

export default UnifiedRegister;
