import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useWriterAuth } from '../contexts/useAuth';

const ProtectedWriterRoute = () => {
    const { isAuthenticated, isLoading } = useWriterAuth();
    const location = useLocation();

    // Tampilkan loading spinner jika status otentikasi sedang diperiksa
    if (isLoading) {
        return <div>Loading...</div>; // Atau komponen loading yang lebih baik
    }

    // Jika pengguna sudah login dan mencoba mengakses halaman login,
    // arahkan mereka ke dasbor.
    if (isAuthenticated && location.pathname === '/writer-portal/login') {
        return <Navigate to="/penulis-portal" replace />;
    }

    // Jika pengguna belum login, arahkan ke halaman login.
    if (!isAuthenticated) {
        return <Navigate to="/writer/login" state={{ from: location }} replace />;
    }

    // Jika sudah login dan mengakses rute terproteksi, tampilkan kontennya.
    return <Outlet />;
};

export default ProtectedWriterRoute;