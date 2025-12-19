# 🚀 QUICK START - Seven INC Frontend

## 1️⃣ Setup Awal (FIRST TIME ONLY)

```bash
cd d:\PROJECT\7inc\frontend

# Install dependencies
npm install

# Clear everything
rm -rf node_modules
npm install

# Start dev server
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 2️⃣ Test Public Pages (NO LOGIN REQUIRED)

```
1. Open http://localhost:5173/
2. Should see landing page (normal, tidak berubah)
3. Click navigasi ke: berita, lowongan, internship
4. Semuanya harus berfungsi normal
```

✅ **Jika berhasil**: Public pages tidak terganggu

---

## 3️⃣ Test Admin Login

### Prerequisites:
- Backend running di `http://127.0.0.1:8000`
- Admin user sudah ada di database

### Steps:
```
1. Go to http://localhost:5173/admin/login
2. Enter credentials:
   - Email: admin@7inc.com (atau sesuai DB)
   - Password: password123
3. Click "Login"
4. Should see loading 1.5 detik
5. Should redirect to http://localhost:5173/admin
6. Should see Dashboard dengan stats cards
7. Sidebar visible di kiri
```

✅ **Jika berhasil**: Admin login bekerja

---

## 4️⃣ Test Writer Login

### Prerequisites:
- Backend support `/api/writer/login`
- Writer user sudah ada di database

### Steps:
```
1. Go to http://localhost:5173/writer/login
2. Enter credentials:
   - Email: writer@7inc.com (atau sesuai DB)
   - Password: password123
3. Click "Login"
4. Should see loading 1.5 detik
5. Should redirect to http://localhost:5173/writer
6. Should see Writer Dashboard
7. Sidebar visible di kiri
```

✅ **Jika berhasil**: Writer login bekerja

---

## 5️⃣ Test Navigation

### Admin:
```
Dashboard → Berita → Lowongan Kerja → Internship
→ Tentang Kami → Bisnis Kami → Kontak → Profil
```

### Writer:
```
Dashboard → Kelola Berita → Kategori
→ Manajemen Media → Profil
```

✅ **Jika semua link work**: Navigation fine

---

## 6️⃣ Test Logout

### Admin:
```
1. Click header kanan
2. Click "Logout" button
3. Should redirect ke /admin/login
4. Try akses /admin → redirect ke login
```

### Writer:
```
1. Click header kanan atau sidebar
2. Click "Logout" button
3. Should redirect ke /writer/login
4. Try akses /writer → redirect ke login
```

✅ **Jika logout work**: Auth system fine

---

## 7️⃣ Test Session Persistence

### Admin:
```
1. Login as admin
2. Go to /admin/berita
3. Press F5 (refresh)
4. Should stay logged in (tidak redirect ke login)
5. User info masih visible di header
6. Logout, then refresh
7. Should redirect ke login (session cleared)
```

### Writer:
```
Same flow tapi untuk /writer
```

✅ **Jika persistence work**: localStorage fine

---

## ⚠️ IF SOMETHING BREAKS

### Option 1: Quick Refresh
```bash
# Browser
Ctrl + F5 (hard refresh)

# Clear localStorage
F12 → Console tab
> localStorage.clear()
> location.reload()
```

### Option 2: Restart Dev Server
```bash
# Terminal
Ctrl + C (stop server)

# Clear cache
rm -rf frontend/.vite

# Restart
npm run dev
```

### Option 3: Full Reset
```bash
# Terminal
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📋 CHECKLIST SEBELUM DEPLOY

- [ ] Public pages work (home, berita, lowongan, dll)
- [ ] Admin login → dashboard → navigation → logout
- [ ] Writer login → dashboard → navigation → logout
- [ ] Session persist after refresh
- [ ] Session clear after logout
- [ ] No error di browser console
- [ ] No red errors di terminal
- [ ] API calls success (check Network tab)

---

## 🎯 NEXT: DEVELOP ADMIN/WRITER PAGES

### Untuk Admin Pages:
Edit file di `frontend/src/admin/pages/` (sudah ada placeholder)

### Untuk Writer Pages:
Edit file di `frontend/src/writer/pages/` (sudah ada placeholder)

### Rules:
- ✅ DO: Modify admin/writer pages
- ✅ DO: Add new routes untuk admin/writer
- ❌ DON'T: Modify public pages
- ❌ DON'T: Modify public routes di main.jsx

---

## 💡 TIPS

1. **Use React DevTools** (F12)
   - Check component tree
   - Monitor state changes
   - Debug render issues

2. **Check Network Tab** (F12)
   - Verify API calls success
   - Check response status (200, 400, 401, etc)
   - See request/response body

3. **Use Console Logs** 
   ```javascript
   console.log("value:", value);
   console.error("Error:", error);
   console.table(data);
   ```

4. **Commit Working Code**
   ```bash
   git add .
   git commit -m "Fix: Admin/Writer auth system"
   git push origin main
   ```

---

## 🆘 COMMON ISSUES

### "Blank page after login"
→ Check browser console (F12) untuk error message

### "Cannot find module"
→ Check file path, pastikan file exists

### "Connection refused" saat login
→ Pastikan backend running di port 8000

### "401 Unauthorized"
→ Check credentials, verify user exists di DB

### "Cannot POST /api/admin/login"
→ Backend belum implement endpoint, atau path salah

---

## 🎓 ARCHITECTURE OVERVIEW

```
Three Separate Systems (Independent):

┌─────────────────────────────────────────┐
│          PUBLIC ROLE                    │
│  (Home, News, Jobs, Internship, etc)   │
│        NO AUTHENTICATION               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          ADMIN ROLE                     │
│  /admin/login → /admin → Dashboard      │
│  → News, Jobs, Internship Management    │
│        AUTHENTICATION REQUIRED          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          WRITER ROLE                    │
│  /writer/login → /writer → Dashboard    │
│  → Create News, View Categories         │
│        AUTHENTICATION REQUIRED          │
└─────────────────────────────────────────┘
```

---

**Status**: ✅ Ready to test & develop

**Last Updated**: December 10, 2025
