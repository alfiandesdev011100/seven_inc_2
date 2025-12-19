# 🚨 TROUBLESHOOTING & DEBUG GUIDE

## Masalah #1: BLACK PAGE / BLANK PAGE Setelah Login

### Penyebab Umum

#### 1.1 Auth Context Tidak Ter-initialize
```javascript
// ❌ WRONG - AuthProvider tidak wrapping app
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* Missing AuthProvider! */}
    <Routes>...
  </BrowserRouter>
);

// ✅ CORRECT
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>...
```

**Fix**: Pastikan `AuthProvider` ada di main.jsx wrapping semuanya

#### 1.2 Component Tidak Render
```javascript
// ❌ PROBLEM - AdminApp return null
function AdminApp() {
  return null; // Blank!
}

// ✅ CORRECT
function AdminApp() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
```

**Fix**: Verify setiap component return JSX, bukan null/undefined

#### 1.3 Layout Component Error
```javascript
// ❌ PROBLEM - Layout tidak ada content area
const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      {/* Missing children/content area! */}
    </div>
  );
};

// ✅ CORRECT
const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
};
```

**Fix**: Pastikan layout render `children` atau `<Outlet />`

### Debug Steps

1. **Open Browser Console (F12)**
   ```
   - Check untuk error messages
   - Look for red X icons
   - Read error stack trace
   ```

2. **Check Network Tab**
   ```
   - Verify login API call berhasil (200 status)
   - Check response body (ada token & user data?)
   - Check localStorage (ada token?)
   ```

3. **Test in React DevTools**
   ```
   - Install React DevTools extension
   - Check AuthContext value
   - Verify component tree rendering
   ```

4. **Add Console Logs**
   ```javascript
   // Di AdminApp.jsx
   function AdminApp() {
     const { isAuthenticated, user } = useAdminAuth();
     
     console.log("AdminApp rendered");
     console.log("isAuthenticated:", isAuthenticated);
     console.log("user:", user);
   
     return ...
   }
   ```

5. **Clear & Restart**
   ```bash
   # Terminal
   Ctrl + C (stop dev server)
   
   # Browser
   Ctrl + Shift + Delete (clear cache)
   localStorage.clear()
   location.reload()
   
   # Terminal
   npm run dev (restart server)
   ```

---

## Masalah #2: "Cannot read property 'role' of null"

### Penyebab & Solusi

```javascript
// ❌ PROBLEM - user bisa null
const { user } = useAdminAuth();
console.log(user.role); // Error jika user null!

// ✅ CORRECT - check dulu
const { user } = useAdminAuth();
if (!user) {
  return <div>Loading...</div>;
}
console.log(user.role); // Safe now
```

### Quick Fix

1. Dalam ProtectedAdminRoute:
```javascript
if (!isAuthenticated) {
  return <Navigate to="/admin/login" />;
}
```

2. Dalam component:
```javascript
const { user } = useAdminAuth();
if (!user) return <PreLoader />;
```

3. Dalam template:
```jsx
<p>{user?.name || "Admin"}</p> {/* Optional chaining */}
```

---

## Masalah #3: Login Redirect Tidak Bekerja

### Debug Checklist

- [ ] Backend return `{status: true, token: "...", admin: {...}}`?
- [ ] Token disimpan di localStorage?
- [ ] `navigate()` dipanggil dengan timeout?
- [ ] Redirect URL benar?

### Fix untuk LoginAdmin.jsx

```javascript
const handleLogin = async (e) => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/admin/login", {
      email, password,
    });

    console.log("Response:", res.data); // DEBUG

    if (res.data.status) {
      const { token, admin } = res.data;
      
      // Save auth
      login(token, admin);
      
      // Verify saved
      console.log("Token saved:", localStorage.getItem("adminToken")); // DEBUG
      console.log("Admin saved:", localStorage.getItem("adminData")); // DEBUG

      // Redirect
      setTimeout(() => {
        console.log("Redirecting to /admin..."); // DEBUG
        navigate("/admin");
      }, 1200);
    }
  } catch (err) {
    console.error("Login error:", err);
  }
};
```

---

## Masalah #4: Public Pages Terganggu

### Proteksi Public Pages

```javascript
// ❌ WRONG - Don't modify public pages
// frontend/src/pages/Berita.jsx
// ❌ Don't add auth check here!

// ✅ CORRECT - Only modify routes
// frontend/src/main.jsx
<Route path="/berita" element={<Berita />} /> // No protection!

// ✅ CORRECT - Protect admin/writer routes
<Route 
  path="/admin" 
  element={
    <ProtectedAdminRoute>
      <AdminApp />
    </ProtectedAdminRoute>
  }
/>
```

### If Public Pages Break

1. **Rollback ke backup:**
   ```bash
   git checkout frontend/src/pages/
   ```

2. **Verify tidak ada changes di public files:**
   ```bash
   git status frontend/src/pages/
   ```

3. **Check CSS conflict:**
   - Inspect element (F12)
   - Check applied styles
   - Search untuk conflicting classes

---

## Masalah #5: Service Worker Error

### Error: "Service Worker registration failed"

```javascript
// Fix di index.html
<script>
  if ("serviceWorker" in navigator) {
    const currentPath = window.location.pathname;
    let swPath = "/admin-sw.js";
    
    if (currentPath.includes("/writer")) {
      swPath = "/writer-sw.js";
    }
    
    navigator.serviceWorker
      .register(swPath)
      .then(reg => console.log("✓ SW registered:", swPath))
      .catch(err => console.error("✗ SW error:", err));
  }
</script>
```

### Verify Service Worker Files

```bash
# Check files exist
ls -la public/admin-sw.js    # Should exist
ls -la public/writer-sw.js   # Should exist
ls -la public/admin-manifest.json   # Should exist
ls -la public/writer-manifest.json  # Should exist
```

---

## Masalah #6: "useAuth must be called inside AuthProvider"

### Penyebab

```javascript
// ❌ WRONG - Component outside of AuthProvider
const AdminSidebar = () => {
  const { user } = useAuth(); // Error!
  return ...
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* AuthProvider NOT here */}
    <Routes>
      <Route path="/admin" element={<AdminSidebar />} />
    </Routes>
  </BrowserRouter>
);
```

### Fix

```javascript
// ✅ CORRECT
createRoot(document.getElementById("root")).render(
  <AuthProvider>  {/* Wrap everything */}
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminSidebar />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
```

---

## Masalah #7: Images/Assets Tidak Muncul

### Fix

```javascript
// ❌ WRONG
<img src="logo.png" />

// ✅ CORRECT
<img src="/assets/logo.png" />

// ✅ CORRECT (imported)
import logo from "/assets/logo.png";
<img src={logo} />
```

### Check File Path

```bash
# From public folder
frontend/public/
  ├── assets/
  │   └── img/
  │       └── logo.png
  │
  # Access as: /assets/img/logo.png
```

---

## QUICK FIXES CHEATSHEET

### Fix #1: Clear Everything & Restart
```bash
rm -rf frontend/node_modules
npm install
rm -rf frontend/.vite
npm run dev
```

### Fix #2: Clear Browser Cache
```
Ctrl + Shift + Delete → Select "All time"
Check: Cookies, Cache, LocalStorage
Clear
```

### Fix #3: Hard Refresh
```
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

### Fix #4: Check API Connection
```bash
# Terminal: Test backend
curl http://127.0.0.1:8000/api/admin/login

# Should not be "Connection refused"
```

### Fix #5: Check Node Version
```bash
node --version  # Should be 16+
npm --version   # Should be 8+
```

---

## COMMON ERROR MESSAGES

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot read property 'role' of null` | User not loaded | Add null check: `user?.role` |
| `useAuth must be called inside provider` | Wrong wrapper | Add AuthProvider to main.jsx |
| `Cannot find module` | Import path wrong | Check path spelling (case-sensitive) |
| `Blank page` | Component not rendering | Check browser console for errors |
| `Cannot POST /api/admin/login` | Backend not running | Start backend server first |
| `401 Unauthorized` | Invalid credentials | Check email/password, verify user exists |
| `Token not found` | localStorage cleared | Login again |

---

## 🎓 BEST PRACTICES

1. **Always check console.log()** - F12 → Console tab
2. **Use React DevTools** - View component tree & state
3. **Test API with Postman** - Before fixing frontend
4. **Commit working code** - Use git commits
5. **One change at a time** - Test after each change
6. **Read error messages** - They contain clues!

---

## 📞 WHEN STUCK

1. Open browser console (F12)
2. Copy full error message
3. Search error on Google / ChatGPT
4. Check file paths (case-sensitive!)
5. Try to reproduce minimal example
6. Ask for help with error details

**Remember**: Error messages are your friend! They tell exactly what's wrong.
