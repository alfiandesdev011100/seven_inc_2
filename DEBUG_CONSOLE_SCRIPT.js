// ===========================================
// 🧪 DEBUG SCRIPT - Copy paste di browser console
// ===========================================

// STEP 1: Check localStorage setelah login
console.log("=== LOCALSTORAGE CHECK ===");
const adminToken = localStorage.getItem('adminToken');
const adminData = localStorage.getItem('adminData');
const writerToken = localStorage.getItem('writerToken');
const writerData = localStorage.getItem('writerData');

console.log("adminToken:", adminToken ? "✅ EXISTS" : "❌ MISSING");
console.log("adminData:", adminData ? "✅ EXISTS" : "❌ MISSING");
console.log("writerToken:", writerToken ? "✅ EXISTS" : "❌ MISSING");
console.log("writerData:", writerData ? "✅ EXISTS" : "❌ MISSING");

// STEP 2: Parse dan check data
if (adminData) {
  try {
    const data = JSON.parse(adminData);
    console.log("Admin Data:", data);
  } catch (e) {
    console.log("❌ adminData invalid JSON:", e.message);
  }
}

// STEP 3: Check current URL
console.log("Current URL:", window.location.pathname);

// STEP 4: Check React Router state
console.log("Expected redirect to /admin or /writer, but at:", window.location.pathname);

// STEP 5: Manual navigation test
// Uncomment untuk manual test:
// window.location.href = '/admin';
