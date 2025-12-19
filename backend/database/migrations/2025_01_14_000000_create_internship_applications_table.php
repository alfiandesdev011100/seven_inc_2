<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('internship_applications', function (Blueprint $table) {
            $table->id();
            
            // Posisi internship
            $table->string('program_magang_pilihan');
            
            // Informasi Dasar
            $table->string('nama_lengkap');
            $table->integer('tahun_lahir');
            $table->string('nim');
            $table->string('email');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->string('no_hp');
            $table->string('asal_sekolah');
            $table->string('program_studi');
            $table->string('fakultas');
            $table->string('kota');
            $table->text('alasan_magang');
            
            // Detail Magang
            $table->enum('jenis_magang', ['Mandiri', 'Kampus']);
            $table->enum('sistem_magang', ['WFO', 'WFH', 'Hybrid']);
            $table->enum('status_saat_ini', ['Masih sekolah', 'Sudah lulus', 'Sudah bekerja']);
            $table->enum('bisa_baca_english', ['Bisa', 'Kurang Bisa', 'Tidak Bisa']);
            $table->string('no_hp_dosen')->nullable();
            $table->date('tanggal_mulai');
            $table->string('durasi');
            $table->enum('tahu_dari', ['Website', 'Instagram', 'Twitter', 'Glints', 'Youtube', 'Other']);
            
            // Pertanyaan Khusus Posisi
            $table->text('software_design')->nullable();
            $table->text('software_video')->nullable();
            $table->text('bahasa_pemrograman')->nullable();
            $table->enum('materi_digital_marketing', ['Organic', 'Ads'])->nullable();
            
            // Peralatan
            $table->enum('punya_alat', ['YA', 'TIDAK']);
            $table->text('alat_spesifikasi')->nullable();
            $table->text('kegiatan_lain')->nullable();
            
            // Info Lainnya
            $table->enum('butuh_info_kost', ['YA', 'TIDAK']);
            $table->enum('sudah_berkeluarga', ['Belum Menikah', 'Sudah Menikah']);
            $table->string('no_hp_wali');
            $table->string('social_media');
            
            // File Uploads
            $table->string('cv_file')->nullable();
            $table->string('ktp_file')->nullable();
            $table->json('portfolio_files')->nullable();
            
            // Status & Timestamps
            $table->enum('status', ['pending', 'reviewed', 'accepted', 'rejected'])->default('pending');
            $table->text('review_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('internship_applications');
    }
};
