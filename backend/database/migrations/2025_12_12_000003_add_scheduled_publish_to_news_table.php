<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news', function (Blueprint $table) {
            // Scheduled publishing
            $table->timestamp('scheduled_publish_at')->nullable()->after('published_at');
            $table->boolean('is_scheduled')->default(false)->after('is_published');
        });
    }

    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn(['scheduled_publish_at', 'is_scheduled']);
        });
    }
};
