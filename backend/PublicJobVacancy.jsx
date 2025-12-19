import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PublicJobVacancy() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/public/job-vacancies')
            .then(res => setJobs(res.data.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center py-10">Memuat lowongan...</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Bergabung Bersama Kami</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Temukan peluang karir terbaik di Seven Inc. Kami mencari talenta berbakat untuk tumbuh bersama.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-800 line-clamp-2">{job.title}</h2>
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    {job.position_count} Posisi
                                </span>
                            </div>
                            
                            <div className="mb-4 text-gray-600 text-sm line-clamp-3">
                                {job.description}
                            </div>

                            <div className="mb-6">
                                <h4 className="font-semibold text-sm text-gray-700 mb-2">Persyaratan:</h4>
                                <p className="text-xs text-gray-500 line-clamp-3 whitespace-pre-line">{job.requirements}</p>
                            </div>

                            <a 
                                href={job.registration_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                            >
                                Daftar Sekarang
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {jobs.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    Saat ini belum ada lowongan yang tersedia.
                </div>
            )}
        </div>
    );
}