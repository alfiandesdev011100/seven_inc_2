import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "cally";

// admin
import AdminApp from "./admin/AdminApp.jsx";
import AdminTentangKamiFull from "./admin/Page/TentangKamiFull.jsx";
import AdminBisnisKamiFull from "./admin/Page/BisnisKamiFull.jsx";
import AdminBerita from "./admin/Page/Berita.jsx";
import AdminKontakFull from "./admin/Page/KontakFull.jsx";
import AdminLowonganKerja from "./admin/Page/LowonganKerja.jsx";
import AdminLowonganKerjaFull from "./admin/Page/LowonganKerjaFull.jsx";
import AdminInternship from "./admin/Page/Internship.jsx";
import AdminSyaratLoker from "./admin/Page/SyaratLoker.jsx";
import AdminIsiBerita from "./admin/Page/IsiBerita.jsx";
import AdminProfil from "./admin/settings/Profil.jsx";
import AdminDashboard from "./admin/home/EditNavbar.jsx";
import AdminEditTentangKami from "./admin/home/EditTentangKami.jsx";
import AdminEditBerita from "./admin/home/EditBerita.jsx";
import AdminEditLowonganKerja from "./admin/home/EditLowonganKerja.jsx";
import AdminEditBisnisKami from "./admin/home/EditBisnisKami.jsx";
import AdminEditPosisiPekerjaan from "./admin/home/EditPosisiPekerjaan.jsx";
import AdminLink from "./admin/home/EditLink.jsx";
import AdminEditInternship from "./admin/home/EditInternship.jsx";
import AdminEditHeroSection from "./admin/home/EditHeroSection.jsx";

// user
import App from "./App.jsx";
import TentangKamiFull from "./pages/TentangKamiFull.jsx";
import BisnisKamiFull from "./pages/BisnisKamiFull.jsx";
import Internship from "./pages/Internship.jsx";
import LowonganKerja from "./pages/LowonganKerja.jsx";
import LowonganKerjaFull from "./pages/LowonganKerjaFull.jsx";
import KontakFull from "./pages/KontakFull.jsx";
import Berita from "./pages/Berita.jsx";
import SyaratLoker from "./pages/SyaratLoker.jsx";
import IsiBerita from "./pages/IsiBerita.jsx";

// halaman Login Admin
import LoginAdmin from "./masuk/LoginAdmin.jsx";

// Admin (Dilindungi dengan ProtectedRouteAdmin)
import ProtectedRouteAdmin from "./components/ProtectedRouteAdmin.jsx";

import "remixicon/fonts/remixicon.css";
import 'animate.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route User */}
        <Route path="/" element={<App />} />
        <Route path="/tentang-kami" element={<TentangKamiFull />} />
        <Route path="/bisnis-kami" element={<BisnisKamiFull />} />
        <Route path="/internship" element={<Internship />} />
        <Route path="/lowongan-kerja" element={<LowonganKerja />} />
        <Route path="/lowongan-full" element={<LowonganKerjaFull />} />
        <Route path="/kontak" element={<KontakFull />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/isi-berita" element={<IsiBerita />} />
        <Route path="/syarat-loker" element={<SyaratLoker />} />

        {/* Route Admin (Dilindungi dengan ProtectedRouteAdmin) */}
        <Route
          path="/admin"
          element={
            <ProtectedRouteAdmin>
              <AdminApp />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/tentang-kami"
          element={
            <ProtectedRouteAdmin>
              <AdminTentangKamiFull />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/bisnis-kami"
          element={
            <ProtectedRouteAdmin>
              <AdminBisnisKamiFull />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/berita"
          element={
            <ProtectedRouteAdmin>
              <AdminBerita />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/kontak"
          element={
            <ProtectedRouteAdmin>
              <AdminKontakFull />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/lowongan-kerja"
          element={
            <ProtectedRouteAdmin>
              <AdminLowonganKerja />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/lowongan-full"
          element={
            <ProtectedRouteAdmin>
              <AdminLowonganKerjaFull />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/internship"
          element={
            <ProtectedRouteAdmin>
              <AdminInternship />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/syarat-loker"
          element={
            <ProtectedRouteAdmin>
              <AdminSyaratLoker />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/isi-berita"
          element={
            <ProtectedRouteAdmin>
              <AdminIsiBerita />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/profil"
          element={
            <ProtectedRouteAdmin>
              <AdminProfil />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRouteAdmin>
              <AdminDashboard />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-info"
          element={
            <ProtectedRouteAdmin>
              <AdminEditTentangKami />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-berita"
          element={
            <ProtectedRouteAdmin>
              <AdminEditBerita />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-loker"
          element={
            <ProtectedRouteAdmin>
              <AdminEditLowonganKerja />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-bisnis-kami"
          element={
            <ProtectedRouteAdmin>
              <AdminEditBisnisKami />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-posisi-pekerjaan"
          element={
            <ProtectedRouteAdmin>
              <AdminEditPosisiPekerjaan />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-link"
          element={
            <ProtectedRouteAdmin>
              <AdminLink />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-internship"
          element={
            <ProtectedRouteAdmin>
              <AdminEditInternship />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/edit-appearance"
          element={
            <ProtectedRouteAdmin>
              <AdminEditHeroSection />
            </ProtectedRouteAdmin>
          }
        />
        
        {/* Route Login Admin */}
        <Route path="/admin-login" element={<LoginAdmin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);