import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useWriterAuth } from "../contexts/useAuth";
import usePWAInit from "../hooks/usePWAInit";
import PreLoader from "../components/PreLoader";
import WriterLayout from "./layouts/WriterLayout";

function WriterApp() {
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useWriterAuth();
    const navigate = useNavigate();

    // Initialize PWA (Service Worker, manifest, etc)
    usePWAInit();

    useEffect(() => {
        const timer = setTimeout(() => {
            // PRIMARY CHECK: localStorage (synchronous, always works)
            const tokenStored = localStorage.getItem("writerToken");
            const dataStored = localStorage.getItem("writerData");
            
            if (tokenStored && dataStored) {
                console.log("✅ [WriterApp] Writer authenticated via localStorage");
                setLoading(false);
                return;
            }
            
            // SECONDARY CHECK: context state (async)
            if (isAuthenticated) {
                console.log("✅ [WriterApp] Writer authenticated via context");
                setLoading(false);
                return;
            }
            
            // NOT AUTHENTICATED - redirect to login
            console.log("⚠️ [WriterApp] Not authenticated - redirect to /login");
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
    const tokenStored = localStorage.getItem("writerToken");
    const dataStored = localStorage.getItem("writerData");
    const isWriterAuth = (tokenStored && dataStored) || isAuthenticated;

    // AUTHENTICATED - RENDER LAYOUT WITH OUTLET
    if (isWriterAuth) {
        return (
            <WriterLayout>
                <Outlet />
            </WriterLayout>
        );
    }

    // FALLBACK - redirect to login
    return (
        <div className="flex justify-center items-center h-screen bg-[#111827]">
            <p className="text-white">Redirecting to login...</p>
        </div>
    );
}

export default WriterApp;