<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Jalankan semua seeders dalam urutan yang benar
        $this->call([
            AdminSeeder::class,      // Buat admin & writer
            CategorySeeder::class,   // Buat kategori berita
            NewsSeeder::class,       // Buat berita (5 artikel dengan status berbeda)
            CommentSeeder::class,    // Buat komentar (approved, spam, pending)
            InternshipProgramSeeder::class,  // Buat internship programs (9 programs)
            InternshipApplicationSeeder::class,  // Buat test data aplikasi internship (6 applications)
        ]);
    }
}
