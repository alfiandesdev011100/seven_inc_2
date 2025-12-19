import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function JobVacancyIndex() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('/api/admin/job-vacancies');
            setJobs(response.data.data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await axios.put(`/api/admin/job-vacancies/${id}`, { is_active: !currentStatus });
            fetchJobs();
        } catch (error) {
            alert('Gagal update status');
        }
    };

    const handleDelete = async (id) => {
        if(!confirm('Hapus lowongan ini?')) return;
        try {
            await axios.delete(`/api/admin/job-vacancies/${id}`);
            fetchJobs();
        } catch (error) {
            alert('Gagal menghapus');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Kelola Lowongan Kerja</h1>
                <Link to="/admin-portal/lowongan-kerja/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    + Tambah Lowongan
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posisi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                        ) : jobs.map((job) => (
                            <tr key={job.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{job.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{job.position_count} Orang</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button 
                                        onClick={() => toggleStatus(job.id, job.is_active)}
                                        className={`px-2 py-1 rounded text-xs font-bold ${job.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                    >
                                        {job.is_active ? 'BUKA' : 'TUTUP'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <Link to={`/admin-portal/lowongan-kerja/${job.id}/kandidat`} className="text-indigo-600 hover:text-indigo-900">
                                        Kelola Kandidat (SPK)
                                    </Link>
                                    <span className="text-gray-300">|</span>
                                    <Link to={`/admin-portal/lowongan-kerja/${job.id}/edit`} className="text-yellow-600 hover:text-yellow-900">
                                        Edit
                                    </Link>
                                    <span className="text-gray-300">|</span>
                                    <button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-900">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}