# Service Workers - Production Only

These Service Worker files are for PRODUCTION builds only.

In DEVELOPMENT:
- Service Workers are completely disabled
- No caching is applied
- Native browser cache is used
- Vite HMR works freely

In PRODUCTION:
- These SW files are served and registered
- PWA offline support is enabled
- Static assets are cached for better performance

Files:
- `admin-sw.js.prod` - Admin portal service worker (rename to admin-sw.js for production)
- `writer-sw.js.prod` - Writer portal service worker (rename to writer-sw.js for production)
