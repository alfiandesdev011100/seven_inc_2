<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InternshipApplication extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'internship_applications';

    protected $fillable = [
        // Posisi internship
        'program_magang_pilihan',
        
        // Informasi Dasar
        'nama_lengkap',
        'tahun_lahir',
        'nim',
        'email',
        'jenis_kelamin',
        'no_hp',
        'asal_sekolah',
        'program_studi',
        'fakultas',
        'kota',
        'alasan_magang',
        
        // Detail Magang
        'jenis_magang',
        'sistem_magang',
        'status_saat_ini',
        'bisa_baca_english',
        'no_hp_dosen',
        'tanggal_mulai',
        'durasi',
        'tahu_dari',
        
        // Pertanyaan Khusus Posisi
        'software_design',
        'software_video',
        'bahasa_pemrograman',
        'materi_digital_marketing',
        
        // Peralatan
        'punya_alat',
        'alat_spesifikasi',
        'kegiatan_lain',
        
        // Info Lainnya
        'butuh_info_kost',
        'sudah_berkeluarga',
        'no_hp_wali',
        'social_media',
        
        // File Uploads
        'cv_file',
        'ktp_file',
        'portfolio_files',
        
        // Status
        'status',
        'review_notes',
    ];

    protected $casts = [
        'portfolio_files' => 'array',
        'tanggal_mulai' => 'date',
    ];

    // Scope untuk filter berdasarkan status
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // Scope untuk filter berdasarkan posisi
    public function scopeByPosition($query, $position)
    {
        return $query->where('program_magang_pilihan', $position);
    }

    // Get all distinct positions
    public static function getPositions()
    {
        return self::distinct('program_magang_pilihan')
                    ->pluck('program_magang_pilihan')
                    ->sort();
    }

    // Get statistics
    public static function getStats()
    {
        return [
            'total' => self::count(),
            'pending' => self::byStatus('pending')->count(),
            'reviewed' => self::byStatus('reviewed')->count(),
            'accepted' => self::byStatus('accepted')->count(),
            'rejected' => self::byStatus('rejected')->count(),
        ];
    }

    // Get statistics by position
    public static function getStatsByPosition()
    {
        return self::selectRaw('program_magang_pilihan, COUNT(*) as count, 
                    SUM(CASE WHEN status = \'pending\' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = \'reviewed\' THEN 1 ELSE 0 END) as reviewed,
                    SUM(CASE WHEN status = \'accepted\' THEN 1 ELSE 0 END) as accepted,
                    SUM(CASE WHEN status = \'rejected\' THEN 1 ELSE 0 END) as rejected')
                    ->groupBy('program_magang_pilihan')
                    ->orderBy('program_magang_pilihan')
                    ->get();
    }
}
