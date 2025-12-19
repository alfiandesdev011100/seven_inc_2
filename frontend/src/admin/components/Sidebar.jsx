import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// --- KOMPONEN DIPINDAHKAN KE LUAR ---

const MenuItem = ({ to, icon, label, location }) => {
  const isActive = location.pathname === to;

  const baseLinkClass =
    "flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden";
  const activeLinkClass = "text-white bg-blue-600 shadow-lg shadow-blue-500/30";
  const inactiveLinkClass = "text-gray-400 hover:text-white hover:bg-white/5";
  const iconClass = "text-lg transition-colors duration-200";

  return (
    <li>
      <Link
        to={to}
        className={`${baseLinkClass} ${
          isActive ? activeLinkClass : inactiveLinkClass
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 animate-pulse"></span>
        )}
        <i
          className={`${icon} ${iconClass} ${
            isActive
              ? "text-cyan-200"
              : "text-gray-500 group-hover:text-gray-300"
          }`}
        />
        <span className="ms-3">{label}</span>
      </Link>
    </li>
  );
};

const DropdownMenu = ({
  title,
  icon,
  id,
  children,
  paths,
  location,
  openMenus,
  setOpenMenus,
}) => {
  const isParentActive = paths.includes(location.pathname);
  const isOpen = openMenus[id];

  useEffect(() => {
    if (isParentActive && !isOpen) {
      setOpenMenus((prev) => ({ ...prev, [id]: true }));
    }
  }, [location.pathname, isParentActive, id, isOpen, setOpenMenus]);

  const baseLinkClass =
    "flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden";
  const activeLinkClass = "text-white bg-white/5";
  const inactiveLinkClass = "text-gray-400 hover:text-white hover:bg-white/5";
  const iconClass = "text-lg transition-colors duration-200";

  const toggleMenu = () => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <li>
      <button
        type="button"
        onClick={toggleMenu}
        className={`${baseLinkClass} w-full ${
          isParentActive ? activeLinkClass : inactiveLinkClass
        }`}
      >
        {isParentActive && (
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-gray-500"></span>
        )}
        <i
          className={`${icon} ${iconClass} ${
            isParentActive ? "text-cyan-400" : "text-gray-500"
          }`}
        />
        <span className="ms-3 flex-1 text-left">{title}</span>
        <i
          className={`ri-arrow-down-s-line transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="py-2 space-y-1 pl-4 relative">
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gray-700"></div>
          {children}
        </ul>
      </div>
    </li>
  );
};

// --- MAIN SIDEBAR ---
const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [role, setRole] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("adminData");
    if (data) {
      const parsed = JSON.parse(data);
      setRole(parsed.role);
    }
  }, []);

  return (
    <aside
      id="admin-sidebar"
      className="h-full w-full bg-[#0f172a] border-r border-gray-800 flex flex-col"
      aria-label="Sidebar"
    >
      {/* Header */}
      <div className="flex-none flex items-center justify-center h-20 border-b border-gray-800 bg-[#0f172a]">
        <Link to="/admin" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
            <span className="text-white font-bold text-lg">7</span>
          </div>
          <span className="text-xl font-bold tracking-wide text-white font-poppins">
            SEVEN <span className="text-blue-500">INC</span>
          </span>
        </Link>
      </div>

      {/* MENU BERDASARKAN ROLE */}
      <div className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
        
        {/* ============================ */}
        {/* ROLE: WRITER (admin_konten) */}
        {/* ============================ */}
        {role === "admin_konten" && (
          <>
            <ul className="space-y-1">
              <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Writer Menu
              </div>

              <MenuItem
                to="/admin/berita"
                icon="ri-newspaper-line"
                label="Kelola Berita"
                location={location}
              />

              <MenuItem
                to="/admin/kategori"
                icon="ri-price-tag-3-line"
                label="Kategori Berita"
                location={location}
              />

              <MenuItem
                to="/admin/media"
                icon="ri-image-line"
                label="Manajemen Media"
                location={location}
              />
            </ul>
          </>
        )}

        {/* ============================ */}
        {/* ROLE: ADMIN */}
        {/* ============================ */}
        {role === "admin" && (
          <>
            {/* Dashboard */}
            <ul className="space-y-1">
              <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main Menu
              </div>

              <MenuItem
                to="/admin"
                icon="ri-dashboard-3-line"
                label="Dashboard"
                location={location}
              />
            </ul>

            {/* Content Manager */}
            <ul className="space-y-1 mt-6">
              <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Content Manager
              </div>

              <MenuItem
                to="/admin/berita"
                icon="ri-newspaper-line"
                label="Berita & Artikel"
                location={location}
              />

              <MenuItem
                to="/admin/internship"
                icon="ri-ship-line"
                label="Program Internship"
                location={location}
              />

              <DropdownMenu
                title="Lowongan Kerja"
                icon="ri-briefcase-2-line"
                id="loker"
                paths={[
                  "/admin/lowongan-kerja",
                  "/admin/edit-loker",
                  "/admin/edit-posisi-pekerjaan",
                  "/admin/syarat-loker",
                ]}
                location={location}
                openMenus={openMenus}
                setOpenMenus={setOpenMenus}
              >
                <MenuItem
                  to="/admin/lowongan-kerja"
                  icon="ri-list-check"
                  label="Daftar Pelamar"
                  location={location}
                />
                <MenuItem
                  to="/admin/edit-loker"
                  icon="ri-file-edit-line"
                  label="Edit Konten Loker"
                  location={location}
                />
                <MenuItem
                  to="/admin/edit-posisi-pekerjaan"
                  icon="ri-user-star-line"
                  label="Posisi Pekerjaan"
                  location={location}
                />
                <MenuItem
                  to="/admin/syarat-loker"
                  icon="ri-file-list-3-line"
                  label="Syarat & Ketentuan"
                  location={location}
                />
              </DropdownMenu>
            </ul>

            {/* Settings */}
            <ul className="space-y-1 mt-6 pt-6 border-t border-gray-800">
              <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Configuration
              </div>

              <DropdownMenu
                title="Tampilan Website"
                icon="ri-layout-masonry-line"
                id="appearance"
                paths={[
                  "/admin/dashboard",
                  "/admin/edit-appearance",
                  "/admin/edit-link",
                ]}
                location={location}
                openMenus={openMenus}
                setOpenMenus={setOpenMenus}
              >
                <MenuItem
                  to="/admin/dashboard"
                  icon="ri-image-edit-line"
                  label="Navbar & Logo"
                  location={location}
                />
                <MenuItem
                  to="/admin/edit-appearance"
                  icon="ri-computer-line"
                  label="Hero Section"
                  location={location}
                />
                <MenuItem
                  to="/admin/edit-link"
                  icon="ri-share-circle-line"
                  label="Sosial Media"
                  location={location}
                />
              </DropdownMenu>

              <DropdownMenu
                title="Info Perusahaan"
                icon="ri-building-4-line"
                id="company"
                paths={[
                  "/admin/edit-info",
                  "/admin/edit-bisnis-kami",
                  "/admin/profil",
                  "/admin/kontak",
                ]}
                location={location}
                openMenus={openMenus}
                setOpenMenus={setOpenMenus}
              >
                <MenuItem
                  to="/admin/edit-info"
                  icon="ri-information-line"
                  label="Tentang Kami"
                  location={location}
                />
                <MenuItem
                  to="/admin/edit-bisnis-kami"
                  icon="ri-shake-hands-line"
                  label="Bisnis Kami"
                  location={location}
                />
                <MenuItem
                  to="/admin/kontak"
                  icon="ri-contacts-book-line"
                  label="Kontak"
                  location={location}
                />
                <MenuItem
                  to="/admin/profil"
                  icon="ri-user-settings-line"
                  label="Akun Admin"
                  location={location}
                />
              </DropdownMenu>
            </ul>
          </>
        )}
      </div>

      <div className="flex-none absolute bottom-0 left-0 w-full px-4 py-3 bg-[#0f172a] border-t border-gray-800 md:static">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-400">System Online v1.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
