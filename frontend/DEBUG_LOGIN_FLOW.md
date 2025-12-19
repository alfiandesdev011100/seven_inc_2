# 🔍 DEBUG LOGIN FLOW

## Masalah yang Dilaporkan
- User login ke `/admin/login` dengan credential yang benar
- Login API return success (status 200, data diterima)
- **Harusnya redirect ke `/admin`**
- **Tapi malah masuk ke `/` (public home)**

## Root Cause Analysis (Ditemukan)

### Issue #1: Context State Tidak Ter-Update
**File**: `src/contexts/AuthContext.jsx`
**Problem**: Saat `loginAdmin(token, admin)` dipanggil, function melakukan:
1. ✅ Save ke localStorage
2. ✅ Update context state dengan `setAdminAuth()`

**Solution**: Confirm context update berhasil dengan debug log

### Issue #2: ProtectedAdminRoute Check Timing
**File**: `src/components/ProtectedAdminRoute.jsx`
**Problem**: Jika context belum ter-update, `isAuthenticated` akan `false`
**Result**: Redirect ke `/admin/login` → kemudian ke `/` (fallback)

## Testing Steps

### Step 1: Check Browser Console
```
1. Open http://localhost:5173/admin/login
2. F12 → Console tab
3. Login dengan email & password valid
```

### Expected Console Output (Sequence):
```
✅ Login response received: { token: "...", admin: { id: 1, name: "...", role: "super_admin" } }
📝 loginAdmin called: { token: "...", admin: { ... } }
✅ adminAuth state updated
📝 useAdminAuth called - adminAuth: { token: "...", data: { ... } }
🔒 ProtectedAdminRoute check: { 
    path: "/admin", 
    isAuthenticated: true, 
    user: { ... }, 
    allowedRoles: ["super_admin", "admin_konten"] 
}
✅ Access granted to /admin
✅ login() called, check localStorage: { 
    adminToken: "...", 
    adminData: "{\"id\":1,...}" 
}
🔄 Redirecting to: /admin
```

### Step 2: Verify localStorage
```javascript
// Di console, jalankan:
localStorage.getItem('adminToken')      // Should return token string
localStorage.getItem('adminData')       // Should return JSON object
```

### Step 3: Refresh Page
```
Tekan Ctrl + F5 (hard refresh)
- AuthContext useEffect harus load data dari localStorage
- ProtectedAdminRoute harus recognize user sudah login
- AdminApp harus render dengan dashboard
```

## Common Issues & Solutions

### ❌ Jika `adminToken` & `adminData` ada tapi redirect ke `/`
**Possible Causes**:
1. `useAdminAuth()` not returning correct `isAuthenticated`
   - Check: `console.log(!!adminAuth)` should be `true`
2. `ProtectedAdminRoute` render timing
   - Check: Loading state di AuthProvider
3. React Router navigation conflict
   - Check: No other route catching `/admin`

### ❌ Jika localStorage kosong setelah login
**Possible Causes**:
1. `loginAdmin()` function tidak di-import dengan benar
   - Check: `useAdminAuth()` return `login` yang merupakan `loginAdmin`
2. `login()` call di LoginAdmin.jsx menggunakan wrong function reference
   - Check: Console harus show `loginAdmin called`

### ❌ Jika Success message muncul tapi tidak redirect
**Possible Causes**:
1. `navigate(target)` timing issue
   - Check: setTimeout 1200ms mungkin kurang, coba 1500ms atau gunakan async/await
2. Router context belum ready
   - Check: BrowserRouter wrapping dengan AuthProvider

## Files Dengan Debug Logs (Updated)

### 1. `src/masuk/LoginAdmin.jsx`
- ✅ Login response log
- ✅ localStorage save verification
- ✅ Redirect target log

### 2. `src/contexts/AuthContext.jsx`
- ✅ loginAdmin called log
- ✅ adminAuth state update log
- ✅ loginWriter called log
- ✅ writerAuth state update log

### 3. `src/components/ProtectedAdminRoute.jsx`
- ✅ Full check log (path, auth status, user, allowed roles)
- ✅ Redirect reason log
- ✅ Access granted log

## Next Steps After Testing

1. **Jika semua logs muncul benar**: Problem sudah fixed, silakan test normal workflow
2. **Jika ada log yang missing**: Trace sequence untuk find missing step
3. **Jika ada error di logs**: Report error message untuk deep debugging

## Important: Check Backend Status
Pastikan backend sudah running:
```bash
cd backend
php artisan serve
# Should show: INFO  Server running on [http://127.0.0.1:8000]
```

## Writer Login (Coming Next)
Akan sama dengan admin, ganti:
- `/admin/login` → `/writer/login`
- `useAdminAuth()` → `useWriterAuth()`
- `/admin` → `/writer`
- `ProtectedAdminRoute` → `ProtectedWriterRoute`
