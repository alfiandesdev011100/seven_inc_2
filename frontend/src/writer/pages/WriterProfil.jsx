import React from "react";
import { useWriterAuth } from "../../contexts/useAuth";

const WriterProfil = () => {
    const { user } = useWriterAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Profil Saya</h1>
            
            <div className="bg-[#1E293B] rounded-lg p-6 border border-gray-700 max-w-2xl">
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Nama</label>
                        <p className="text-white">{user?.name}</p>
                    </div>
                    
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Email</label>
                        <p className="text-white">{user?.email}</p>
                    </div>
                    
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Role</label>
                        <p className="text-white capitalize">{user?.role}</p>
                    </div>
                </div>
                
                <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    Edit Profil
                </button>
            </div>
        </div>
    );
};

export default WriterProfil;
