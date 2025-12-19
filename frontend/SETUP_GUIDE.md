# 🔧 Perbaikan Sistem Role & Auth - Seven INC

## 📋 Daftar Perbaikan Utama

### 1. ✅ **Struktur Auth Terpisah (3 Role Independen)**
- **Public**: Tidak memerlukan autentikasi (tetap tidak berubah)
- **Admin**: Autentikasi dengan `/admin/login`
- **Writer**: Autentikasi dengan `/writer/login`

### 2. ✅ **Sistem Context API Terpusat**
Mengganti langsung localStorage dengan context yang terkelola:
- `AuthContext`: Menyimpan state auth untuk semua role
- `useAuth()`: Hook umum untuk akses auth
- `useAdminAuth()`: Hook khusus untuk admin
- `useWriterAuth()`: Hook khusus untuk writer

### 3. ✅ **Protected Routes yang Benar**
- `ProtectedAdminRoute`: Hanya admin yang bisa akses
- `ProtectedWriterRoute`: Hanya writer yang bisa akses
- Redirect otomatis ke login jika belum autentikasi

### 4. ✅ **Routing Bersih & Terstruktur**
```
PUBLIC ROUTES:
/ → Home
/berita → News list
/lowongan-kerja → Jobs
/internship → Internship
(... dan lainnya)

ADMIN ROUTES:
/admin/login → Admin login
/admin → Dashboard (protected)
/admin/berita → Manage news
/admin/lowongan-kerja → Manage jobs
... (other admin features)

WRITER ROUTES:
/writer/login → Writer login
/writer → Dashboard (protected)
/writer/berita → Write news
/writer/kategori → View categories
/writer/media → Media management
```

### 5. ✅ **PWA Support**
- Service workers untuk offline capability
- Manifests terpisah untuk admin & writer
- Install button di home screen

## 🚀 Cara Menggunakan

### Setup Awal
```bash
cd frontend
npm install
npm run dev
```

### Login Admin
1. Buka http://localhost:5173/admin/login
2. Masukkan email & password admin
3. Akan redirect ke `/admin` dashboard

### Login Writer
1. Buka http://localhost:5173/writer/login
2. Masukkan email & password writer
3. Akan redirect ke `/writer` dashboard

## 📁 Struktur File Baru

```
src/
├── contexts/
│   ├── AuthContext.jsx      ← Context provider
│   └── useAuth.js           ← Custom hooks
├── components/
│   ├── ProtectedAdminRoute.jsx
│   └── ProtectedWriterRoute.jsx
├── admin/
│   ├── AdminApp.jsx
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── AdminSidebar.jsx
│   │   └── AdminHeader.jsx
│   └── pages/
│       └── AdminDashboard.jsx
├── writer/
│   ├── WriterApp.jsx
│   ├── layouts/
│   │   ├── WriterLayout.jsx
│   │   └── WriterSidebar.jsx
│   └── pages/
│       └── WriterDashboard.jsx
├── masuk/
│   ├── LoginAdmin.jsx
│   └── LoginWriter.jsx
└── main.jsx                 ← Main routing
```

## 🔐 Alur Login yang Benar

### Admin Login Flow
```
1. LoginAdmin.jsx
   ↓
2. Kirim axios ke /api/admin/login
   ↓
3. Backend return token + admin data
   ↓
4. useAdminAuth().login(token, admin)
   ↓
5. Data tersimpan di AuthContext + localStorage
   ↓
6. Redirect ke /admin
   ↓
7. ProtectedAdminRoute cek auth
   ↓
8. Render AdminApp → AdminLayout → AdminDashboard
```

### Writer Login Flow
```
1. LoginWriter.jsx
   ↓
2. Kirim axios ke /api/writer/login
   ↓
3. Backend return token + writer data
   ↓
4. useWriterAuth().login(token, writer)
   ↓
5. Data tersimpan di AuthContext + localStorage
   ↓
6. Redirect ke /writer
   ↓
7. ProtectedWriterRoute cek auth
   ↓
8. Render WriterApp → WriterLayout → WriterDashboard
```

## 🐛 Troubleshooting

### Masalah: Blank Page Setelah Login
**Solusi:**
1. Clear localStorage: `localStorage.clear()`
2. Restart aplikasi
3. Pastikan backend API running di `http://127.0.0.1:8000`
4. Check browser console untuk error

### Masalah: 404 pada Admin/Writer Pages
**Solusi:**
1. Pastikan file berikut ada:
   - `src/components/ProtectedAdminRoute.jsx`
   - `src/components/ProtectedWriterRoute.jsx`
   - `src/contexts/AuthContext.jsx`
   - `src/contexts/useAuth.js`

### Masalah: Public Role Terganggu
**Jangan ubah:**
- `src/App.jsx`
- `src/pages/*.jsx`
- Public routes di main.jsx
- Public components styling

**Hanya ubah:**
- Admin pages di `src/admin/pages/`
- Writer pages di `src/writer/pages/`
- Admin/Writer layouts

## 🔄 Sync dengan Backend

Backend Anda harus provide endpoints:

### Admin
- `POST /api/admin/login` → return `{status, admin, token}`
- `GET /api/admin/news`
- `GET /api/admin/jobs`
- `GET /api/admin/internships`

### Writer
- `POST /api/writer/login` → return `{status, writer, token}`
- `GET /api/writer/news`
- `GET /api/writer/categories`
- `POST /api/writer/news` → create news

## 📱 PWA Configuration

Setiap role memiliki manifest & service worker sendiri:
- Admin: `admin-manifest.json` + `admin-sw.js`
- Writer: `writer-manifest.json` + `writer-sw.js`

Automatic registration di `index.html` berdasarkan current path.

## ✨ Next Steps

1. **Implementasikan endpoint writer di backend:**
   - `/api/writer/login`
   - `/api/writer/news`
   - `/api/writer/categories`

2. **Buat pages untuk admin & writer:**
   - News management
   - Category management
   - Media management

3. **Test semua login flows**

4. **Deploy ke production**

---

**Status:** ✅ Struktur core siap, tinggal isi pages & backend integration
