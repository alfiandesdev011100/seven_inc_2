import { useEffect } from "react";

/**
 * PWA INITIALIZATION HOOK
 * Registers service workers for admin & writer portals
 * Completely isolated per role
 */
export const usePWAInit = () => {
  useEffect(() => {
    // Skip PWA registration in development mode
    // Service workers are for production builds only
    const isDevelopment = !window.location.hostname.includes("7inc.com");
    
    if (isDevelopment) {
      console.log("⚙️ [PWA] Development mode: Service Worker disabled (use for production only)");
      return;
    }

    // Register Admin Service Worker
    const registerAdminSW = async () => {
      try {
        if ("serviceWorker" in navigator) {
          // Check if we're in admin portal
          const path = window.location.pathname;
          if (path.startsWith("/admin-portal")) {
            const registration = await navigator.serviceWorker.register(
              "/admin-sw.js",
              {
                scope: "/admin-portal/",
              }
            );
            console.log(
              "✅ [PWA] Admin Service Worker registered:",
              registration
            );
          }
        }
      } catch (error) {
        console.error("❌ [PWA] Admin Service Worker registration failed:", error);
      }
    };

    // Register Writer Service Worker
    const registerWriterSW = async () => {
      try {
        if ("serviceWorker" in navigator) {
          // Check if we're in writer portal
          const path = window.location.pathname;
          if (path.startsWith("/writer-portal")) {
            const registration = await navigator.serviceWorker.register(
              "/writer-sw.js",
              {
                scope: "/writer-portal/",
              }
            );
            console.log(
              "✅ [PWA] Writer Service Worker registered:",
              registration
            );
          }
        }
      } catch (error) {
        console.error("❌ [PWA] Writer Service Worker registration failed:", error);
      }
    };

    // Initialize both on mount
    registerAdminSW();
    registerWriterSW();
  }, []);
};

export default usePWAInit;
