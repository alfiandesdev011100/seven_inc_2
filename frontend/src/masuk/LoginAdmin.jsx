import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../contexts/useAuth";

/**
 * ADMIN LOGIN PAGE - DEPRECATED
 * 
 * This component is kept for backward compatibility only.
 * The new unified login page is at /login
 * 
 * This page will redirect to /login automatically.
 */
const LoginAdmin = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        console.warn("⚠️ [LoginAdmin] Deprecated - Redirecting to /login");
        navigate("/login", { replace: true });
    }, [navigate]);

    return null;
};

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../contexts/useAuth";

/**
 * ADMIN LOGIN PAGE - DEPRECATED
 * 
 * This component is kept for backward compatibility only.
 * The new unified login page is at /login
 * 
 * This page will redirect to /login automatically.
 */
const LoginAdmin = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        console.warn("⚠️ [LoginAdmin] Deprecated - Redirecting to /login");
        navigate("/login", { replace: true });
    }, [navigate]);

    return null;
};

export default LoginAdmin;
