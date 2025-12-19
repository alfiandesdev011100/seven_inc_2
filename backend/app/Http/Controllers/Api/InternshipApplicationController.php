<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InternshipApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class InternshipApplicationController extends Controller
{
    // Store a new internship application
    public function store(Request $request)
    {
        try {
            // Validate input
            $validator = Validator::make($request->all(), [
                'nama_lengkap' => 'required|string|max:255',
                'tahun_lahir' => 'required|integer|min:1970|max:' . date('Y'),
                'nim' => 'required|string|max:20',
                'email' => 'required|email|max:255',
                'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
                'no_hp' => 'required|string|max:20',
                'asal_sekolah' => 'required|string|max:255',
                'program_studi' => 'required|string|max:255',
                'fakultas' => 'required|string|max:255',
                'kota' => 'required|string|max:100',
                'alasan_magang' => 'required|string',
                'program_magang_pilihan' => 'required|string|max:100',
                'jenis_magang' => 'required|in:Mandiri,Kampus',
                'sistem_magang' => 'required|in:WFO,WFH,Hybrid',
                'status_saat_ini' => 'required|in:Masih sekolah,Sudah lulus,Sudah bekerja',
                'bisa_baca_english' => 'required|in:Bisa,Kurang Bisa,Tidak Bisa',
                'tanggal_mulai' => 'required|date|after:today',
                'durasi' => 'required|string|max:100',
                'tahu_dari' => 'required|in:Website,Instagram,Twitter,Glints,Youtube,Other',
                'punya_alat' => 'required|in:YA,TIDAK',
                'butuh_info_kost' => 'required|in:YA,TIDAK',
                'sudah_berkeluarga' => 'required|in:Belum Menikah,Sudah Menikah',
                'no_hp_wali' => 'required|string|max:20',
                'social_media' => 'required|string|max:255',
                'cv_file' => 'required|file|mimes:pdf|max:10240',
                'ktp_file' => 'required|file|mimes:pdf|max:10240',
                'portfolio_files' => 'required|array|min:1|max:5',
                'portfolio_files.*' => 'file|mimes:pdf,jpg,jpeg,png|max:10240',
                'terms_agreed' => 'required|boolean|accepted',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Handle file uploads
            $cvPath = null;
            $ktpPath = null;
            $portfolioFiles = [];

            // Upload CV
            if ($request->hasFile('cv_file')) {
                $cvPath = $request->file('cv_file')->store(
                    'internship/cv/' . date('Y/m'),
                    'public'
                );
            }

            // Upload KTP
            if ($request->hasFile('ktp_file')) {
                $ktpPath = $request->file('ktp_file')->store(
                    'internship/ktp/' . date('Y/m'),
                    'public'
                );
            }

            // Upload Portfolio Files
            if ($request->hasFile('portfolio_files')) {
                foreach ($request->file('portfolio_files') as $file) {
                    $portfolioPath = $file->store(
                        'internship/portfolio/' . date('Y/m'),
                        'public'
                    );
                    $portfolioFiles[] = $portfolioPath;
                }
            }

            // Create application
            $application = InternshipApplication::create([
                'nama_lengkap' => $request->nama_lengkap,
                'tahun_lahir' => $request->tahun_lahir,
                'nim' => $request->nim,
                'email' => $request->email,
                'jenis_kelamin' => $request->jenis_kelamin,
                'no_hp' => $request->no_hp,
                'asal_sekolah' => $request->asal_sekolah,
                'program_studi' => $request->program_studi,
                'fakultas' => $request->fakultas,
                'kota' => $request->kota,
                'alasan_magang' => $request->alasan_magang,
                'program_magang_pilihan' => $request->program_magang_pilihan,
                'jenis_magang' => $request->jenis_magang,
                'sistem_magang' => $request->sistem_magang,
                'status_saat_ini' => $request->status_saat_ini,
                'bisa_baca_english' => $request->bisa_baca_english,
                'no_hp_dosen' => $request->no_hp_dosen,
                'tanggal_mulai' => $request->tanggal_mulai,
                'durasi' => $request->durasi,
                'tahu_dari' => $request->tahu_dari,
                'software_design' => $request->software_design,
                'software_video' => $request->software_video,
                'bahasa_pemrograman' => $request->bahasa_pemrograman,
                'materi_digital_marketing' => $request->materi_digital_marketing,
                'punya_alat' => $request->punya_alat,
                'alat_spesifikasi' => $request->alat_spesifikasi,
                'kegiatan_lain' => $request->kegiatan_lain,
                'butuh_info_kost' => $request->butuh_info_kost,
                'sudah_berkeluarga' => $request->sudah_berkeluarga,
                'no_hp_wali' => $request->no_hp_wali,
                'social_media' => $request->social_media,
                'cv_file' => $cvPath,
                'ktp_file' => $ktpPath,
                'portfolio_files' => $portfolioFiles,
                'status' => 'pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Formulir internship berhasil dikirim. Silakan tunggu konfirmasi dari admin melalui WhatsApp.',
                'data' => $application
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Admin: Get all internship applications
    public function index(Request $request)
    {
        try {
            $query = InternshipApplication::query();

            // Filter by position
            if ($request->has('position') && $request->position) {
                $query->byPosition($request->position);
            }

            // Filter by status
            if ($request->has('status') && $request->status) {
                $query->byStatus($request->status);
            }

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%$search%")
                      ->orWhere('email', 'like', "%$search%")
                      ->orWhere('nim', 'like', "%$search%")
                      ->orWhere('no_hp', 'like', "%$search%");
                });
            }

            // Pagination
            $perPage = $request->input('per_page', 15);
            $applications = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => [
                    'applications' => $applications,
                    'stats' => InternshipApplication::getStats(),
                    'stats_by_position' => InternshipApplication::getStatsByPosition(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data aplikasi internship',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Admin: Get single application
    public function show($id)
    {
        try {
            $application = InternshipApplication::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $application
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Aplikasi internship tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Admin: Update application status
    public function updateStatus(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:pending,reviewed,accepted,rejected',
                'review_notes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $application = InternshipApplication::findOrFail($id);
            $application->update([
                'status' => $request->status,
                'review_notes' => $request->review_notes
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status aplikasi berhasil diperbarui',
                'data' => $application
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status aplikasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Admin: Get applications by position
    public function byPosition($position)
    {
        try {
            $applications = InternshipApplication::byPosition($position)
                ->orderBy('created_at', 'desc')
                ->paginate(15);

            return response()->json([
                'success' => true,
                'data' => [
                    'position' => $position,
                    'applications' => $applications,
                    'stats' => [
                        'total' => InternshipApplication::byPosition($position)->count(),
                        'pending' => InternshipApplication::byPosition($position)->byStatus('pending')->count(),
                        'reviewed' => InternshipApplication::byPosition($position)->byStatus('reviewed')->count(),
                        'accepted' => InternshipApplication::byPosition($position)->byStatus('accepted')->count(),
                        'rejected' => InternshipApplication::byPosition($position)->byStatus('rejected')->count(),
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil aplikasi berdasarkan posisi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Admin: Delete application
    public function destroy($id)
    {
        try {
            $application = InternshipApplication::findOrFail($id);
            
            // Delete files
            if ($application->cv_file) {
                Storage::disk('public')->delete($application->cv_file);
            }
            if ($application->ktp_file) {
                Storage::disk('public')->delete($application->ktp_file);
            }
            if ($application->portfolio_files) {
                foreach ($application->portfolio_files as $file) {
                    Storage::disk('public')->delete($file);
                }
            }

            $application->delete();

            return response()->json([
                'success' => true,
                'message' => 'Aplikasi berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus aplikasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Admin: Get statistics by position
    public function statisticsByPosition()
    {
        try {
            $stats = InternshipApplication::selectRaw('program_magang_pilihan, COUNT(*) as total, 
                        SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending,
                        SUM(CASE WHEN status = "reviewed" THEN 1 ELSE 0 END) as reviewed,
                        SUM(CASE WHEN status = "accepted" THEN 1 ELSE 0 END) as accepted,
                        SUM(CASE WHEN status = "rejected" THEN 1 ELSE 0 END) as rejected')
                ->groupBy('program_magang_pilihan')
                ->orderBy('total', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Admin: Bulk update status
    public function bulkUpdateStatus(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer',
                'status' => 'required|in:pending,reviewed,accepted,rejected'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            InternshipApplication::whereIn('id', $request->ids)
                ->update(['status' => $request->status]);

            return response()->json([
                'success' => true,
                'message' => 'Status berhasil diperbarui untuk ' . count($request->ids) . ' aplikasi'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Admin: Export applications
    public function export(Request $request)
    {
        try {
            $query = InternshipApplication::query();

            if ($request->has('position') && $request->position) {
                $query->byPosition($request->position);
            }

            if ($request->has('status') && $request->status) {
                $query->byStatus($request->status);
            }

            $applications = $query->get();

            $csv = fopen('php://memory', 'w');
            fputcsv($csv, ['Nama', 'NIM', 'Email', 'No HP', 'Posisi', 'Status', 'Tanggal Daftar']);

            foreach ($applications as $app) {
                fputcsv($csv, [
                    $app->nama_lengkap,
                    $app->nim,
                    $app->email,
                    $app->no_hp,
                    $app->program_magang_pilihan,
                    $app->status,
                    $app->created_at->format('Y-m-d H:i:s')
                ]);
            }

            rewind($csv);
            $content = stream_get_contents($csv);
            fclose($csv);

            return response($content, 200)
                ->header('Content-Type', 'text/csv')
                ->header('Content-Disposition', 'attachment; filename="internship_applications_' . date('Y-m-d') . '.csv"');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal export data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

