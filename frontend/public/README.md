# Public Assets

This directory contains static files served by Vite.

## Service Worker Files

- `admin-sw.js` - Admin Service Worker (Production only)
- `writer-sw.js` - Writer Service Worker (Production only)

**NOTE:** Service Workers are DISABLED in development mode to prevent conflicts with Vite HMR.
They are only registered and used in production builds.

## Manifest Files

- `admin-manifest.json` - PWA manifest for admin portal
- `writer-manifest.json` - PWA manifest for writer portal

## Assets

- `assets/` - Images, fonts, and other static resources
