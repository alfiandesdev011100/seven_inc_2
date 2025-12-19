<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Writer;

class WriterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test writer
        Writer::create([
            'name' => 'Test Writer',
            'email' => 'writer@seveninc.com',
            'password' => Hash::make(env('SEEDER_WRITER_PASSWORD', 'password123')),
            'role' => 'writer',
            'avatar' => null,
        ]);
    }
}
