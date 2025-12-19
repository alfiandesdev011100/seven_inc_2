<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InternshipApplication;

class InternshipApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ✓ Seeder kosong - menggunakan data pengujian asli nantinya
        // Tidak ada data dummy untuk menghindari konflik dengan data real testing
        
        // Catatan: 
        // - 18 divisi/posisi sudah tersedia di backend
        // - Data aplikasi akan diisi melalui form API saat testing
        // - Gunakan API endpoint POST /api/internship-applications untuk membuat data test
    }
}
