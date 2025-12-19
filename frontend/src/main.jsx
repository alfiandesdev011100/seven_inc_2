import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// ============ ISOLATED AUTH PROVIDERS ============
import { PublicAuthProvider } from "./contexts/PublicAuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { WriterAuthProvider } from "./contexts/WriterAuthContext";

// ============ PUBLIC PAGES ============
import App from "./App.jsx";
import TentangKamiFull from "./pages/TentangKamiFull.jsx";
import BisnisKamiFull from "./pages/BisnisKamiFull.jsx";
import Internship from "./pages/Internship.jsx";
import InternshipRegister from "./pages/InternshipRegister.jsx";
import LowonganKerja from "./pages/LowonganKerja.jsx";
import LowonganKerjaFull from "./pages/LowonganKerjaFull.jsx";
import KontakFull from "./pages/KontakFull.jsx";
import Berita from "./pages/Berita.jsx";
import IsiBerita from "./pages/IsiBerita.jsx";
import SyaratLoker from "./pages/SyaratLoker.jsx";

// ============ UNIFIED LOGIN ============
import UnifiedLogin from "./masuk/UnifiedLogin.jsx";
import UnifiedRegister from "./masuk/UnifiedRegister.jsx";

// ============ ADMIN ROUTES ============
import AdminApp from "./admin/AdminApp.jsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import BeritaAdmin from "./admin/pages/BeritaAdmin.jsx";
import KategoriAdmin from "./admin/pages/KategoriAdmin.jsx";
import LowonganKerjaAdmin from "./admin/pages/LowonganKerjaAdmin.jsx";
import InternshipAdmin from "./admin/pages/InternshipAdmin.jsx";
import InternshipApplicationManager from "./admin/pages/InternshipApplicationManager.jsx";
import InternshipDivisionManager from "./admin/pages/InternshipDivisionManager.jsx";
import TentangKamiAdmin from "./admin/pages/TentangKamiAdmin.jsx";
import BisnisKamiAdmin from "./admin/pages/BisnisKamiAdmin.jsx";
import KontakAdmin from "./admin/pages/KontakAdmin.jsx";
import ProfilAdmin from "./admin/pages/ProfilAdmin.jsx";

// ============ WRITER ROUTES ============
import WriterApp from "./writer/WriterApp.jsx";
import ProtectedWriterRoute from "./components/ProtectedWriterRoute.jsx";
import WriterDashboard from "./writer/pages/WriterDashboard";
import WriterBerita from "./writer/pages/WriterBerita";
import WriterKategori from "./writer/pages/WriterKategori";
import WriterMedia from "./writer/pages/WriterMedia";
import WriterProfil from "./writer/pages/WriterProfil";

// ============ PLUGINS ============
import "remixicon/fonts/remixicon.css";
import "animate.css";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

// ============ ENTRY POINT ============
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 
      COMPLETE ISOLATION ARCHITECTURE
      Each role has its own provider + isolated state
      NO shared context between roles
    */}
    <PublicAuthProvider>
      <AdminAuthProvider>
        <WriterAuthProvider>
          <BrowserRouter>
            <Routes>
              {/* ===================================
                  1. PUBLIC ROUTES - COMPLETELY ISOLATED
                  Routes: /, /tentang-kami, /berita, etc
                  Fallback: / (PUBLIC HOME)
                  
                  ⚠️ DO NOT MODIFY PUBLIC ROUTES
              =================================== */}
              <Route path="/" element={<App />} />
              <Route path="/tentang-kami" element={<TentangKamiFull />} />
              <Route path="/bisnis-kami" element={<BisnisKamiFull />} />
              <Route path="/internship" element={<Internship />} />
              <Route path="/internship-register" element={<InternshipRegister />} />
              <Route path="/lowongan-kerja" element={<LowonganKerja />} />
              <Route path="/lowongan-full" element={<LowonganKerjaFull />} />
              <Route path="/kontak" element={<KontakFull />} />
              <Route path="/berita" element={<Berita />} />
              <Route path="/isi-berita/:id" element={<IsiBerita />} />
              <Route path="/syarat-loker" element={<SyaratLoker />} />

              {/* ===================================
                  2. UNIFIED LOGIN & REGISTER PAGES
                  Single entry point for both admin & writer
                  Auto-detects role from backend response
                  Routes: /login, /register
              =================================== */}
              <Route path="/login" element={<UnifiedLogin />} />
              <Route path="/register" element={<UnifiedRegister />} />

              {/* ===================================
                  3. ADMIN PORTAL - COMPLETELY ISOLATED
                  Routes: /admin-portal/*, /admin
                  Fallback: /login (shared unified login)
                  
                  State: AdminAuthContext (adminToken, adminData)
                  Isolation: NO access to writer state
              =================================== */}
              <Route 
                path="/admin-portal" 
                element={
                  <ProtectedAdminRoute>
                    <AdminApp />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="berita" element={<BeritaAdmin />} />
                <Route path="kategori" element={<KategoriAdmin />} />
                <Route path="lowongan-kerja" element={<LowonganKerjaAdmin />} />
                <Route path="internship" element={<InternshipAdmin />} />
                <Route path="internship/applications" element={<InternshipApplicationManager />} />
                <Route path="internship/applications/:positionSlug" element={<InternshipDivisionManager />} />
                <Route path="tentang-kami" element={<TentangKamiAdmin />} />
                <Route path="bisnis-kami" element={<BisnisKamiAdmin />} />
                <Route path="kontak" element={<KontakAdmin />} />
                <Route path="profil" element={<ProfilAdmin />} />
              </Route>

              {/* Backward compatibility alias */}
              <Route path="/admin" element={<Navigate to="/admin-portal" replace />} />

              {/* ===================================
                  4. WRITER PORTAL - COMPLETELY ISOLATED
                  Routes: /writer-portal/*, /writer
                  Fallback: /login (shared unified login)
                  
                  State: WriterAuthContext (writerToken, writerData)
                  Isolation: NO access to admin state
              =================================== */}
              <Route 
                path="/writer-portal" 
                element={
                  <ProtectedWriterRoute>
                    <WriterApp />
                  </ProtectedWriterRoute>
                }
              >
                <Route index element={<WriterDashboard />} />
                <Route path="berita" element={<WriterBerita />} />
                <Route path="kategori" element={<WriterKategori />} />
                <Route path="media" element={<WriterMedia />} />
                <Route path="profil" element={<WriterProfil />} />
              </Route>

              {/* Backward compatibility alias */}
              <Route path="/writer" element={<Navigate to="/writer-portal" replace />} />

              {/* ===================================
                  5. GLOBAL FALLBACK - PUBLIC ONLY
                  Any unknown path -> PUBLIC HOME
              =================================== */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </WriterAuthProvider>
      </AdminAuthProvider>
    </PublicAuthProvider>
  </StrictMode>
);
