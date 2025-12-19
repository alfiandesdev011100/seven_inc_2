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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->string('action'); // 'create', 'update', 'delete', 'publish', 'approve', 'reject'
            $table->string('model_type'); // 'news', 'category', 'job_work', 'admin', 'writer', etc
            $table->unsignedBigInteger('model_id')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->string('user_type'); // 'admin', 'writer'
            $table->json('changes')->nullable(); // Store old & new values for comparison
            $table->text('description')->nullable(); // Human-readable description
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            
            $table->timestamps();
            
            // Add indexes for better query performance
            $table->index('action');
            $table->index('model_type');
            $table->index('user_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
