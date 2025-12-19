import React from "react";
import { Outlet } from "react-router-dom";
import WriterSidebar from "./WriterSidebar";

const WriterLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-[#111827]">
            {/* Sidebar */}
            <WriterSidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {children || <Outlet />}
            </div>
        </div>
    );
};

export default WriterLayout;
