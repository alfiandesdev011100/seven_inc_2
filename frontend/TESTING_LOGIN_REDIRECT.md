# 🧪 TESTING GUIDE - LOGIN REDIRECT FIX

## ✅ Backend Setup (SELESAI)

### Database Setup
- ✅ Writers table dibuat dengan columns: id, name, email, password, avatar, role, timestamps
- ✅ WriterAuthController dibuat dengan endpoint `/api/writer/login`
- ✅ WriterSeeder dibuat dengan test account:
  ```
  Email: writer@seveninc.com
  Password: password123
  Role: writer
  ```
- ✅ Route `/api/writer/login` didaftarkan di `routes/api.php`

### Admin Test Account (Sudah Ada)
```
Email: super@seveninc.com
Password: password123
Role: super_admin
```

---

## 🚀 Testing Steps

### STEP 1: Pastikan Backend Running
```bash
cd d:\PROJECT\7inc\backend
php artisan serve
# Expected output: INFO  Server running on [http://127.0.0.1:8000]
```

### STEP 2: Pastikan Frontend Running
```bash
cd d:\PROJECT\7inc\frontend
npm run dev
# Expected output: VITE v... ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

### STEP 3: Test Admin Login (/admin/login)

**URL**: `http://localhost:5173/admin/login`

**Credentials**:
- Email: `super@seveninc.com`
- Password: `password123`

**Expected Behavior**:
1. ✅ Form submit berhasil
2. ✅ Success message "Login berhasil!" muncul
3. ✅ Console logs muncul (check F12 → Console):
   ```
   ✅ Login response received: { token: "...", admin: {...} }
   📝 loginAdmin called: { token: "...", admin: {...} }
   ✅ adminAuth state updated
   📝 useAdminAuth called - adminAuth: { token: "...", data: {...} }
   🔒 ProtectedAdminRoute check: {...}
   ✅ Access granted to /admin
   🔄 Redirecting to: /admin
   ```
4. ✅ **CRITICAL**: Page redirect ke `/admin` (bukan `/`)
5. ✅ Admin Dashboard tampil dengan:
   - Sidebar menu (Dashboard, Berita, Kategori, etc.)
   - "Welcome Super Administrator" message
   - Stat cards (Total News, Categories, Jobs, Internships)

**If Redirect Fails**:
- Console harus show kenapa: cek `isAuthenticated`, `localStorage`, routing

---

### STEP 4: Test Writer Login (/writer/login)

**URL**: `http://localhost:5173/writer/login`

**Credentials**:
- Email: `writer@seveninc.com`
- Password: `password123`

**Expected Behavior**:
1. ✅ Form submit berhasil
2. ✅ Success message "Login berhasil!" muncul
3. ✅ Console logs muncul:
   ```
   ✅ Writer login response received: { token: "...", writer: {...} }
   📝 loginWriter called: { token: "...", writer: {...} }
   ✅ writerAuth state updated
   📝 useWriterAuth called - writerAuth: { token: "...", data: {...} }
   🔒 ProtectedWriterRoute check: {...}
   ✅ Writer access granted to /writer
   🔄 Redirecting to: /writer
   ```
4. ✅ **CRITICAL**: Page redirect ke `/writer` (bukan `/`)
5. ✅ Writer Dashboard tampil dengan:
   - Sidebar menu (Dashboard, Kelola Berita, Kategori, Media, Profil)
   - Welcome message

---

### STEP 5: Test Public Pages (HARUS TETAP NORMAL)

**Test URLs**:
- `http://localhost:5173/` → Home page (public)
- `http://localhost:5173/tentang-kami` → About page
- `http://localhost:5173/lowongan-kerja` → Jobs page
- `http://localhost:5173/berita` → News page

**Expected**: Semua public pages tetap tampil normal, tidak ada redirect ke login

---

### STEP 6: Test Logout & Re-login

**Admin Logout**:
1. Dari Admin Dashboard, click "Logout" di sidebar
2. Expected: Redirect ke `/admin/login`
3. localStorage clear: `adminToken` & `adminData` hapus
4. Try go to `/admin` directly → redirect ke `/admin/login` (protected)

**Writer Logout**:
1. Dari Writer Dashboard, click "Logout" di sidebar
2. Expected: Redirect ke `/writer/login`
3. localStorage clear
4. Try go to `/writer` directly → redirect ke `/writer/login` (protected)

---

### STEP 7: Test Page Refresh (Data Persistence)

**Admin Refresh**:
1. Login ke admin: `/admin/login` → redirect ke `/admin` ✅
2. Refresh page (Ctrl+F5)
3. Expected: Tetap di `/admin` dashboard (tidak redirect ke login)
4. Why: AuthContext load `adminToken` & `adminData` dari localStorage saat mount

**Writer Refresh**:
1. Login ke writer: `/writer/login` → redirect ke `/writer` ✅
2. Refresh page (Ctrl+F5)
3. Expected: Tetap di `/writer` dashboard

---

## 🔍 Debugging Tips

### Issue: "After login, redirect ke /"
**Check Console**:
```javascript
// Paste di F12 Console:
localStorage.getItem('adminToken')    // Should return token string
localStorage.getItem('adminData')     // Should return JSON string
localStorage.getItem('writerToken')   // Should return token string  
localStorage.getItem('writerData')    // Should return JSON string
```

**Check Network Tab** (F12 → Network):
1. Klik login button
2. Cari request ke `http://127.0.0.1:8000/api/admin/login`
3. Response harus: `{ status: true, admin: {...}, token: "..." }`
4. Status harus: `200 OK` (bukan 401, 500, etc)

### Issue: "API Error saat login"
**Backend Console** (terminal dimana `php artisan serve` running):
- Should show request log
- If error: check `/api/admin/login` endpoint exist di `routes/api.php`

### Issue: "Sidebar tidak muncul / styling error"
- Check: Tailwind CSS running
- Console: Cek ada error tentang missing components
- Refresh: Hard refresh (Ctrl+Shift+R) untuk clear cache

---

## ✅ Success Criteria

**Test berhasil jika**:
1. ✅ Admin login `/admin/login` → auto redirect ke `/admin` dashboard
2. ✅ Writer login `/writer/login` → auto redirect ke `/writer` dashboard
3. ✅ Public pages (`/`, `/berita`, etc) tidak terganggu
4. ✅ Console tidak ada error (hanya debug logs)
5. ✅ localStorage punya token & data setelah login
6. ✅ Refresh page tetap logged in (dari localStorage)
7. ✅ Logout clear localStorage & redirect ke login page
8. ✅ Try akses `/admin` tanpa login → redirect ke `/admin/login`
9. ✅ Try akses `/writer` tanpa login → redirect ke `/writer/login`

---

## 📋 Credentials untuk Testing

| Role | Email | Password | URL |
|------|-------|----------|-----|
| Super Admin | super@seveninc.com | password123 | http://localhost:5173/admin/login |
| Writer | writer@seveninc.com | password123 | http://localhost:5173/writer/login |

---

## 🎯 Next Steps (Jika Semua Berhasil)

1. **Implement Admin Pages**: News CRUD, Category CRUD, Job management
2. **Implement Writer Pages**: News create form, media upload, profile edit
3. **Implement Protected API Routes**: Backend routes dengan auth middleware
4. **Test dengan real data**: Buat news, categories, etc dari admin/writer dashboard

---

## 📞 Troubleshooting Checklist

- [ ] Backend running? (`php artisan serve`)
- [ ] Frontend running? (`npm run dev`)
- [ ] MySQL running? (XAMPP dashboard)
- [ ] Writers table ada? (phpMyAdmin → Database)
- [ ] Test writer account ada? (writers table → writer@seveninc.com)
- [ ] API routes registered? (check `routes/api.php`)
- [ ] No console errors? (F12 → Console tab)
- [ ] localStorage updated? (F12 → Application → LocalStorage)
