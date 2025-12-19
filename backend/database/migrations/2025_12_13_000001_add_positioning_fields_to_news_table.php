<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * ADDITIVE MIGRATION: Menambahkan position tracking fields ke News table
     * Tidak menghapus atau mengubah fields yang sudah ada
     */
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            // Positioning fields - untuk tracking dimana konten ditampilkan
            if (!Schema::hasColumn('news', 'target_page')) {
                $table->string('target_page')->nullable()->default('berita')
                    ->comment('Halaman target: beranda, berita, tentang-kami, bisnis-kami, karir');
            }
            
            if (!Schema::hasColumn('news', 'target_section')) {
                $table->string('target_section')->nullable()->default('body')
                    ->comment('Section target: hero, featured, body, sidebar, carousel, footer');
            }
            
            if (!Schema::hasColumn('news', 'target_menu')) {
                $table->string('target_menu')->nullable()->default('main-list')
                    ->comment('Menu target: main-list, featured-slider, sidebar-admin');
            }
            
            if (!Schema::hasColumn('news', 'position_order')) {
                $table->integer('position_order')->nullable()->default(0)
                    ->comment('Urutan tampilan (1, 2, 3, dst) dalam section');
            }
            
            if (!Schema::hasColumn('news', 'position_notes')) {
                $table->text('position_notes')->nullable()
                    ->comment('Catatan detail positioning: "Di featured card, di atas fold"');
            }

            // Enhanced workflow status - skip approved_at (already exists)
            // Admin approval tracking - skip approved_by_admin_id (we have approved_by)

            // Monitoring & takedown tracking
            if (!Schema::hasColumn('news', 'view_count')) {
                $table->integer('view_count')->default(0)
                    ->comment('Jumlah views dari public');
            }
            
            if (!Schema::hasColumn('news', 'last_monitored_at')) {
                $table->dateTime('last_monitored_at')->nullable()
                    ->comment('Terakhir dicek admin');
            }
            
            if (!Schema::hasColumn('news', 'takedown_reason')) {
                $table->string('takedown_reason')->nullable()
                    ->comment('Alasan jika di-takedown');
            }
            
            if (!Schema::hasColumn('news', 'taken_down_at')) {
                $table->dateTime('taken_down_at')->nullable()
                    ->comment('Waktu di-takedown');
            }

            // Track if created directly by admin
            if (!Schema::hasColumn('news', 'created_by_admin')) {
                $table->boolean('created_by_admin')->default(false)
                    ->comment('Apakah dibuat langsung oleh admin (bukan dari writer)');
            }

            // Add indexes untuk query yang lebih cepat
            if (!Schema::hasColumn('news', 'target_page')) {
                // Skip if columns don't exist yet
            } else {
                // Only add indexes if columns exist
                try {
                    $table->index('target_page');
                    $table->index('target_section');
                    $table->index('position_order');
                } catch (\Exception $e) {
                    // Index might already exist
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $columns = [];
            
            // Only drop columns that exist
            if (Schema::hasColumn('news', 'target_page')) {
                $columns[] = 'target_page';
            }
            if (Schema::hasColumn('news', 'target_section')) {
                $columns[] = 'target_section';
            }
            if (Schema::hasColumn('news', 'target_menu')) {
                $columns[] = 'target_menu';
            }
            if (Schema::hasColumn('news', 'position_order')) {
                $columns[] = 'position_order';
            }
            if (Schema::hasColumn('news', 'position_notes')) {
                $columns[] = 'position_notes';
            }
            if (Schema::hasColumn('news', 'view_count')) {
                $columns[] = 'view_count';
            }
            if (Schema::hasColumn('news', 'last_monitored_at')) {
                $columns[] = 'last_monitored_at';
            }
            if (Schema::hasColumn('news', 'takedown_reason')) {
                $columns[] = 'takedown_reason';
            }
            if (Schema::hasColumn('news', 'taken_down_at')) {
                $columns[] = 'taken_down_at';
            }
            if (Schema::hasColumn('news', 'created_by_admin')) {
                $columns[] = 'created_by_admin';
            }

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }

            // Try to drop indexes (may fail if they don't exist, that's ok)
            try {
                $table->dropIndex(['target_page']);
            } catch (\Exception $e) {}
            try {
                $table->dropIndex(['target_section']);
            } catch (\Exception $e) {}
            try {
                $table->dropIndex(['position_order']);
            } catch (\Exception $e) {}
        });
    }
};
