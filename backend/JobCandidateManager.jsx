import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

export default function JobCandidateManager() {
    const { id } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCandidates();
    }, [id]);

    const fetchCandidates = async () => {
        const res = await axios.get(`/api/admin/job-candidates/${id}`);
        setCandidates(res.data.data);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert('Pilih file CSV terlebih dahulu');

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            await axios.post(`/api/admin/job-candidates/${id}/import`, formData);
            alert('Upload berhasil!');
            fetchCandidates();
        } catch (error) {
            alert('Gagal upload. Pastikan format CSV benar.');
        } finally {
            setLoading(false);
        }
    };

    const runSPK = async () => {
        try {
            setLoading(true);
            await axios.post(`/api/admin/job-candidates/${id}/calculate-spk`);
            alert('Perhitungan SPK Selesai! Data telah diurutkan berdasarkan rekomendasi.');
            fetchCandidates();
        } catch (error) {
            alert('Gagal menjalankan SPK');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link to="/admin-portal/lowongan-kerja" className="text-gray-500 hover:text-gray-700">← Kembali ke Lowongan</Link>
                <h1 className="text-2xl font-bold mt-2">Manajemen Kandidat & SPK</h1>
                <p className="text-sm text-gray-600">Upload data kandidat dan jalankan SPK untuk mendapatkan rekomendasi.</p>
            </div>

            {/* Upload Section */}
            <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="font-bold mb-2">1. Upload Data Kandidat (Manual)</h3>
                <form onSubmit={handleUpload} className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">File CSV (Format: Name, Email, Phone, Adm, Int, Test, Exp)</label>
                        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} className="border p-2 rounded" />
                    </div>
                    <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        {loading ? 'Uploading...' : 'Upload CSV'}
                    </button>
                </form>
            </div>

            {/* SPK Section */}
            <div className="bg-white p-4 rounded shadow mb-6 flex justify-between items-center">
                <div>
                    <h3 className="font-bold">2. Proses SPK (SAW)</h3>
                    <p className="text-sm text-gray-500">Sistem akan menghitung skor dan meranking kandidat secara otomatis.</p>
                </div>
                <button onClick={runSPK} disabled={loading || candidates.length === 0} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 font-bold">
                    Jalankan SPK
                </button>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ranking</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Kandidat</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nilai Akhir (SPK)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detail Nilai</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {candidates.map((c, index) => (
                            <tr key={c.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                                <td className="px-6 py-4 font-bold text-gray-700">#{index + 1}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{c.name}</div>
                                    <div className="text-sm text-gray-500">{c.email}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-indigo-600">
                                    {c.final_score.toFixed(4)}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    Adm: {c.score_admin} | Int: {c.score_interview} | Test: {c.score_test} | Exp: {c.experience_years}
                                </td>
                            </tr>
                        ))}
                        {candidates.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Belum ada data kandidat. Silakan upload CSV.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}