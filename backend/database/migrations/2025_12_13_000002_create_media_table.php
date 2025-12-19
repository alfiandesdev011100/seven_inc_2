<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * NEW TABLE: Media management untuk foto/video/dokumen
     */
    public function up(): void
    {
        // If media table already exists from old migration, we need to add columns to it
        if (Schema::hasTable('media')) {
            Schema::table('media', function (Blueprint $table) {
                // Add new fields to existing media table if they don't exist
                if (!Schema::hasColumn('media', 'news_id')) {
                    $table->unsignedBigInteger('news_id')->nullable()->after('id');
                    $table->foreign('news_id')->references('id')->on('news')->onDelete('cascade');
                }
                if (!Schema::hasColumn('media', 'media_type')) {
                    $table->enum('media_type', ['image', 'video', 'document'])->default('image')->after('news_id');
                }
                if (!Schema::hasColumn('media', 'file_path')) {
                    $table->string('file_path')->nullable()->after('media_type');
                }
                if (!Schema::hasColumn('media', 'file_size')) {
                    $table->integer('file_size')->nullable();
                }
                if (!Schema::hasColumn('media', 'position_in_article')) {
                    $table->integer('position_in_article')->default(0);
                }
                if (!Schema::hasColumn('media', 'caption')) {
                    $table->text('caption')->nullable();
                }
                if (!Schema::hasColumn('media', 'alt_text')) {
                    $table->string('alt_text')->nullable();
                }
                if (!Schema::hasColumn('media', 'is_approved')) {
                    $table->boolean('is_approved')->default(false);
                }
                if (!Schema::hasColumn('media', 'approved_by_admin_id')) {
                    $table->unsignedBigInteger('approved_by_admin_id')->nullable();
                    $table->foreign('approved_by_admin_id')->references('id')->on('admins')->onDelete('set null');
                }
                if (!Schema::hasColumn('media', 'approved_at')) {
                    $table->dateTime('approved_at')->nullable();
                }
                if (!Schema::hasColumn('media', 'rejection_reason')) {
                    $table->text('rejection_reason')->nullable();
                }
                if (!Schema::hasColumn('media', 'uploaded_by_writer_id')) {
                    // Rename or add writer relationship
                    if (Schema::hasColumn('media', 'writer_id')) {
                        // Already has writer_id from old migration, just ensure it's proper
                    } else {
                        $table->unsignedBigInteger('uploaded_by_writer_id')->nullable();
                        $table->foreign('uploaded_by_writer_id')->references('id')->on('writers')->onDelete('cascade');
                    }
                }
                if (!Schema::hasColumn('media', 'uploaded_at')) {
                    $table->dateTime('uploaded_at')->useCurrent();
                }
            });
        } else {
            // Create new media table (for fresh installations)
            Schema::create('media', function (Blueprint $table) {
                $table->id();

                // Reference ke News
                $table->unsignedBigInteger('news_id');
                $table->foreign('news_id')->references('id')->on('news')->onDelete('cascade');

                // Media Info
                $table->enum('media_type', ['image', 'video', 'document'])->default('image');
                $table->string('file_path');
                $table->integer('file_size')->nullable();
                $table->string('mime_type')->nullable();
                $table->string('original_filename')->nullable();

                // Positioning dalam artikel
                $table->integer('position_in_article')->default(0);
                $table->text('caption')->nullable();
                $table->string('alt_text')->nullable();

                // Admin approval
                $table->boolean('is_approved')->default(false);
                $table->unsignedBigInteger('approved_by_admin_id')->nullable();
                $table->foreign('approved_by_admin_id')->references('id')->on('admins')->onDelete('set null');
                $table->dateTime('approved_at')->nullable();
                $table->text('rejection_reason')->nullable();

                // Tracking
                $table->unsignedBigInteger('uploaded_by_writer_id');
                $table->foreign('uploaded_by_writer_id')->references('id')->on('writers')->onDelete('cascade');
                $table->dateTime('uploaded_at')->useCurrent();

                // Indexes
                $table->index('news_id');
                $table->index('uploaded_by_writer_id');
                $table->index('is_approved');

                // Timestamps
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
