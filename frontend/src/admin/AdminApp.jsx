import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../contexts/useAuth";
import usePWAInit from "../hooks/usePWAInit";
import PreLoader from "../components/PreLoader";
import AdminLayout from "./layouts/AdminLayout";

function AdminApp() {
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user } = useAdminAuth();
    const navigate = useNavigate();

    // Initialize PWA (Service Worker, manifest, etc)
    usePWAInit();

    useEffect(() => {
        const timer = setTimeout(() => {
            // PRIMARY CHECK: localStorage (synchronous, always works)
            const tokenStored = localStorage.getItem("adminToken");
            const dataStored = localStorage.getItem("adminData");
            
            if (tokenStored && dataStored) {
                console.log("✅ [AdminApp] Admin authenticated via localStorage");
                setLoading(false);
                return;
            }
            
            // SECONDARY CHECK: context state (async)
            if (isAuthenticated && user) {
                console.log("✅ [AdminApp] Admin authenticated via context");
                setLoading(false);
                return;
            }
            
            // NOT AUTHENTICATED - redirect to login
            console.log("⚠️ [AdminApp] Not authenticated - redirect to /login");
            navigate("/login", { replace: true });
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);  // ← Empty dependency - run only once on mount

    // SHOW LOADING
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#111827]">
                <PreLoader />
            </div>
        );
    }

    // CHECK AGAIN: localStorage or context
    const tokenStored = localStorage.getItem("adminToken");
    const dataStored = localStorage.getItem("adminData");
    const isAdminAuth = (tokenStored && dataStored) || (isAuthenticated && user);

    // AUTHENTICATED - RENDER LAYOUT WITH OUTLET
    if (isAdminAuth) {
        return (
            <AdminLayout>
                <Outlet />
            </AdminLayout>
        );
    }

    // FALLBACK - redirect to login
    return (
        <div className="flex justify-center items-center h-screen bg-[#111827]">
            <p className="text-white">Redirecting to login...</p>
        </div>
    );
}

export default AdminApp;