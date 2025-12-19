<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use App\Models\Writer;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Buat atau update Administrator
        Admin::updateOrCreate(
            ['email' => 'super@seveninc.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make(env('SEEDER_ADMIN_PASSWORD', 'password123')),
                'role' => 'admin',
                'avatar' => null,
            ]
        );

        // 2. Buat atau update Writer
        Writer::updateOrCreate(
            ['email' => 'writer@seveninc.com'],
            [
                'name' => 'Content Writer',
                'password' => Hash::make(env('SEEDER_WRITER_PASSWORD', 'password123')),
                'role' => 'writer',
            ]
        );
    }
}
