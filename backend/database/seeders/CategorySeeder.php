<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Integritas dan Disiplin', 'slug' => 'integritas-disiplin', 'description' => 'Berita tentang nilai integritas dan disiplin di Seven INC'],
            ['name' => 'Pengembangan SDM', 'slug' => 'pengembangan-sdm', 'description' => 'Artikel tentang pengembangan sumber daya manusia dan pelatihan'],
            ['name' => 'Inovasi Produk', 'slug' => 'inovasi-produk', 'description' => 'Berita tentang inovasi dan pengembangan produk Seven INC'],
            ['name' => 'Berita Perusahaan', 'slug' => 'berita-perusahaan', 'description' => 'Berita terkini dan update kegiatan Seven INC'],
            ['name' => 'Testimoni dan Cerita Sukses', 'slug' => 'testimoni-cerita-sukses', 'description' => 'Cerita sukses dari tim dan mitra Seven INC'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
