import { useEffect, useRef, useState } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";

const API_BASE = "http://127.0.0.1:8000/api";

// Ambil token admin dari localStorage → sesuai pola project-mu
const tokenHeader = () => {
    const t = localStorage.getItem("adminToken");
    return t ? { Authorization: `Bearer ${t}` } : {};
};

const initialForm = {
    idOrSlug: null,       // diisi setelah berhasil create
    title: "",
    author: "",
    excerpt: "",
    body: "",
    cover: null,          // File
    coverPreview: "",     // URL preview
    is_published: false,
    published_at: null,
    updated_at: null,
};

const Field = ({ label, children, required }) => (
    <label className="block mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </span>
        {children}
    </label>
);

const Pill = ({ children, color = "gray" }) => {
    const map = {
        gray: "bg-gray-100 text-gray-700",
        green: "bg-green-100 text-green-700",
        yellow: "bg-yellow-100 text-yellow-700",
        red: "bg-red-100 text-red-700",
    };
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${map[color]}`}>
            {children}
        </span>
    );
};

const EditBerita = () => {
    const [form, setForm] = useState(initialForm);
    const [busy, setBusy] = useState(false);
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState("");

    // Utility: format tanggal "28 Jul 2025"
    const fmtDate = (iso) => {
        if (!iso) return "";
        try {
            const d = new Date(iso);
            return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" })
                .format(d)
                .replace(".", "");
        } catch {
            return "";
        }
    };

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const handleFile = (e) => {
        const f = e.target.files?.[0] || null;
        if (!f) {
            setForm((s) => ({ ...s, cover: null, coverPreview: "" }));
            return;
        }
        setForm((s) => ({ ...s, cover: f, coverPreview: URL.createObjectURL(f) }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setMessage("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ===== API Calls =====
    const createOrUpdate = async ({ publish = false } = {}) => {
        setBusy(true);
        setMessage("");
        try {
            const data = new FormData();
            // hanya kirim field yang perlu
            if (form.title) data.append("title", form.title);
            if (form.excerpt) data.append("excerpt", form.excerpt);
            if (form.body) data.append("body", form.body);
            if (form.author) data.append("author", form.author);
            if (form.cover) data.append("cover", form.cover);
            data.append("is_published", publish ? "1" : "0");

            if (!form.idOrSlug) {
                // CREATE
                const res = await axios.post(`${API_BASE}/admin/news`, data, {
                    headers: { ...tokenHeader(), "Content-Type": "multipart/form-data" },
                });
                const n = res.data?.data;
                setForm((s) => ({
                    ...s,
                    idOrSlug: n.slug || String(n.id),
                    is_published: !!n.is_published,
                    published_at: n.published_at,
                    updated_at: n.updated_at,
                    cover: null, // clear file after upload
                    coverPreview: n.cover_url || s.coverPreview,
                }));
                setMessage(publish ? "Berita dibuat & dipublish." : "Draft disimpan.");
            } else {
                // UPDATE (tanpa mengubah status publish)
                const res = await axios.patch(`${API_BASE}/admin/news/${form.idOrSlug}`, data, {
                    headers: { ...tokenHeader(), "Content-Type": "multipart/form-data" },
                });
                const n = res.data?.data;
                setForm((s) => ({
                    ...s,
                    is_published: !!n.is_published,
                    published_at: n.published_at,
                    updated_at: n.updated_at,
                    cover: null,
                    coverPreview: n.cover_url || s.coverPreview,
                }));
                setMessage("Draft/berita berhasil diperbarui.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Terjadi kesalahan. Pastikan sudah login (token) & field wajib terisi.");
        } finally {
            setBusy(false);
        }
    };

    const togglePublish = async (nextState) => {
        if (!form.idOrSlug) return;
        setBusy(true);
        setMessage("");
        try {
            const res = await axios.post(
                `${API_BASE}/admin/news/${form.idOrSlug}/publish`,
                { is_published: !!nextState },
                { headers: tokenHeader() }
            );
            const n = res.data?.data;
            setForm((s) => ({
                ...s,
                is_published: !!n.is_published,
                published_at: n.published_at,
                updated_at: n.updated_at,
            }));
            setMessage(nextState ? "Berita dipublish." : "Berita di-unpublish (kembali menjadi draft).");
        } catch (err) {
            console.error(err);
            setMessage("Gagal mengubah status publish. Cek token & endpoint.");
        } finally {
            setBusy(false);
        }
    };

    const remove = async () => {
        if (!form.idOrSlug) return;
        if (!confirm("Yakin hapus berita ini?")) return;
        setBusy(true);
        setMessage("");
        try {
            await axios.delete(`${API_BASE}/admin/news/${form.idOrSlug}`, {
                headers: tokenHeader(),
            });
            resetForm();
            setMessage("Berita dihapus.");
        } catch (err) {
            console.error(err);
            setMessage("Gagal menghapus. Cek token & endpoint.");
        } finally {
            setBusy(false);
        }
    };

    // ===== UI =====
    return (
        <AdminLayout>
            <div className="max-w-[1100px] mx-auto px-6 py-8 text-black">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl text-black font-bold">Edit Berita</h3>
                    <div className="space-x-2">
                        {form.idOrSlug ? (
                            form.is_published ? <Pill color="green">Published</Pill> : <Pill color="yellow">Draft</Pill>
                        ) : (
                            <Pill>Baru</Pill>
                        )}
                        {form.published_at && <Pill color="gray">{fmtDate(form.published_at)}</Pill>}
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Field label="Judul" required>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    placeholder="Tulis judul berita…"
                                />
                            </Field>

                            <Field label="Penulis">
                                <input
                                    name="author"
                                    value={form.author}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    placeholder="Nama penulis (opsional)…"
                                />
                            </Field>

                            <Field label="Ringkasan (Excerpt)">
                                <textarea
                                    name="excerpt"
                                    value={form.excerpt}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    placeholder="Ringkasan singkat (maks ~500 karakter)…"
                                />
                            </Field>
                        </div>

                        <div>
                            <Field label="Cover (jpg/png/webp)">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFile}
                                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                                />
                                {(form.coverPreview) && (
                                    <div className="mt-3">
                                        <img
                                            src={form.coverPreview}
                                            alt="Preview"
                                            className="w-full max-h-56 object-cover rounded-lg border"
                                        />
                                    </div>
                                )}
                            </Field>

                            <div className="mt-6 flex flex-wrap gap-3">
                                {/* Simpan Draft (create or update) */}
                                <button
                                    disabled={busy}
                                    onClick={() => createOrUpdate({ publish: false })}
                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-50"
                                >
                                    {form.idOrSlug ? "Simpan Perubahan (Draft)" : "Simpan Draft"}
                                </button>

                                {/* Publish / Unpublish */}
                                {form.idOrSlug ? (
                                    form.is_published ? (
                                        <button
                                            disabled={busy}
                                            onClick={() => togglePublish(false)}
                                            className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
                                        >
                                            Unpublish
                                        </button>
                                    ) : (
                                        <button
                                            disabled={busy}
                                            onClick={() => togglePublish(true)}
                                            className="inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                        >
                                            Publish
                                        </button>
                                    )
                                ) : (
                                    <button
                                        disabled={busy}
                                        onClick={() => createOrUpdate({ publish: true })}
                                        className="inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Publish Sekarang
                                    </button>
                                )}

                                {/* Hapus */}
                                {form.idOrSlug && (
                                    <button
                                        disabled={busy}
                                        onClick={remove}
                                        className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Hapus
                                    </button>
                                )}

                                {/* Reset */}
                                <button
                                    disabled={busy}
                                    onClick={resetForm}
                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-gray-700 border hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Buat Baru
                                </button>
                            </div>
                        </div>
                    </div>

                    <Field label="Isi Berita (Body)" required>
                        <textarea
                            name="body"
                            value={form.body}
                            onChange={handleChange}
                            rows={12}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Tulis isi berita lengkap (HTML/Text)…"
                        />
                    </Field>
                </div>

                {/* Info */}
                {message && (
                    <div className="mt-4">
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                            {message}
                        </div>
                    </div>
                )}

                {/* Catatan kecil */}
                <div className="mt-6 text-xs text-gray-500">
                    <p>
                        * Simpan Draft: membuat atau memperbarui berita tanpa tampil ke publik.
                    </p>
                    <p>
                        * Publish: mengubah status jadi tampil di landing page. Unpublish: kembali menjadi draft.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EditBerita;