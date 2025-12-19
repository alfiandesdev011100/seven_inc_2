<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * NEW TABLE: Instruksi/assignment dari admin ke writer
     */
    public function up(): void
    {
        Schema::create('content_assignments', function (Blueprint $table) {
            $table->id();

            // Reference ke News (optional, bisa untuk berita existing atau instruction saja)
            $table->unsignedBigInteger('news_id')->nullable();
            $table->foreign('news_id')->references('id')->on('news')->onDelete('set null');

            // Assignment Info
            $table->unsignedBigInteger('assigned_by_admin_id');
            $table->foreign('assigned_by_admin_id')->references('id')->on('admins')->onDelete('cascade');
            $table->unsignedBigInteger('assigned_to_writer_id');
            $table->foreign('assigned_to_writer_id')->references('id')->on('writers')->onDelete('cascade');

            // Position requirements
            $table->string('required_page')->nullable()
                ->comment('Halaman target yang diminta admin');
            $table->string('required_section')->nullable()
                ->comment('Section target yang diminta');
            $table->string('required_menu')->nullable()
                ->comment('Menu target yang diminta');
            $table->integer('position_order')->nullable()
                ->comment('Urutan yang diminta');

            // Instruction
            $table->text('instruction')
                ->comment('Instruksi detail dari admin ke writer');
            $table->text('context_reference')->nullable()
                ->comment('Referensi konteks: "Lihat halaman Beranda bagian Featured"');

            // Status
            $table->enum('status', ['pending', 'acknowledged', 'in_progress', 'submitted', 'completed'])
                ->default('pending')
                ->comment('Status assignment');
            $table->dateTime('due_date')->nullable();

            // Tracking
            $table->dateTime('acknowledged_at')->nullable();
            $table->dateTime('completed_at')->nullable();

            // Indexes
            $table->index('assigned_by_admin_id');
            $table->index('assigned_to_writer_id');
            $table->index('news_id');
            $table->index('status');

            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_assignments');
    }
};
