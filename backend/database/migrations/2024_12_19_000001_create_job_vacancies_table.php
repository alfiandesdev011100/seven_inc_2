<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('job_vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->integer('position_count')->default(1);
            $table->text('description')->nullable();
            $table->text('requirements')->nullable();
            $table->string('registration_link')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('job_candidates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_vacancy_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            // Kriteria SPK
            $table->float('score_admin')->default(0);     // Nilai Administrasi
            $table->float('score_interview')->default(0); // Nilai Wawancara
            $table->float('score_test')->default(0);      // Nilai Tes Tulis
            $table->float('experience_years')->default(0);// Pengalaman (Tahun)
            $table->float('final_score')->default(0);     // Hasil SPK
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('job_candidates');
        Schema::dropIfExists('job_vacancies');
    }
};