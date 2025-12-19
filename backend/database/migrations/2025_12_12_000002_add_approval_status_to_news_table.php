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
        Schema::table('news', function (Blueprint $table) {
            // Tambah status approval jika belum ada
            if (!Schema::hasColumn('news', 'status')) {
                $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('draft')->after('is_published');
            }
            
            // Siapa yang approve
            if (!Schema::hasColumn('news', 'approved_by')) {
                $table->unsignedBigInteger('approved_by')->nullable()->after('status');
            }
            
            // Alasan rejection
            if (!Schema::hasColumn('news', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('approved_by');
            }
            
            // Timestamp approval
            if (!Schema::hasColumn('news', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('rejection_reason');
            }
            
            // Foreign key
            if (!Schema::hasColumn('news', 'rejected_at')) {
                $table->timestamp('rejected_at')->nullable()->after('approved_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'approved_by',
                'rejection_reason',
                'approved_at',
                'rejected_at',
            ]);
        });
    }
};
