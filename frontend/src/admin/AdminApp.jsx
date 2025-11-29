import { useState, useEffect } from "react";
import PreLoader from "./components/PreLoader";
import AdminLandingPage from "./components/AdminLandingPage";

function AdminApp() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-screen bg-[#111827]">
                    <PreLoader />
                </div>
            ) : (
                <AdminLandingPage />
            )}
        </>
    );
}

export default AdminApp;