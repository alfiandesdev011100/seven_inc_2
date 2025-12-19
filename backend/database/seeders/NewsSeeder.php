<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;
use App\Models\Writer;
use App\Models\Category;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $writer = Writer::first();
        $categories = Category::all();

        if (!$writer || $categories->isEmpty()) {
            return;
        }

        $newsData = [
            [
                'title' => 'Integritas dan Disiplin, Dua Pilar Penting Pembentukan SDM Berkualitas di Seven INC',
                'slug' => 'integritas-disiplin-sdm-berkualitas',
                'author' => 'HR Team Seven INC',
                'excerpt' => 'Integritas dan disiplin adalah nilai fundamental yang kami tanamkan pada setiap anggota tim untuk membangun SDM berkualitas tinggi.',
                'body' => 'Integritas dan disiplin merupakan dua pilar penting dalam membangun sumber daya manusia yang berkualitas di Seven INC. Setiap insan Seven INC berkomitmen untuk menjalankan tugas dengan penuh kejujuran, tanggung jawab, dan kedisiplinan tinggi. Nilai-nilai ini tercermin dalam setiap aspek pekerjaan kami, dari pelayanan kepada pelanggan hingga kolaborasi internal antar tim.',
                'status' => 'approved',
                'is_published' => true,
                'published_at' => now()->subDays(5),
                'category_id' => $categories->where('slug', 'integritas-disiplin')->first()->id,
                'writer_id' => $writer->id,
            ],
            [
                'title' => 'Program Pengembangan SDM: Pelatihan Karyawan Tingkat Lanjut 2025',
                'slug' => 'program-pengembangan-sdm-2025',
                'author' => 'Divisi Pengembangan Talenta',
                'excerpt' => 'Seven INC meluncurkan program pengembangan SDM komprehensif untuk meningkatkan kompetensi dan skill karyawan.',
                'body' => 'Dalam upaya meningkatkan kualitas sumber daya manusia, Seven INC meluncurkan program pengembangan SDM yang mencakup pelatihan teknis, soft skills, dan kepemimpinan. Program ini dirancang untuk memberikan kesempatan bagi setiap karyawan untuk mengembangkan potensi maksimal mereka dan berkontribusi lebih optimal pada pertumbuhan perusahaan.',
                'status' => 'approved',
                'is_published' => true,
                'published_at' => now()->subDays(3),
                'category_id' => $categories->where('slug', 'pengembangan-sdm')->first()->id,
                'writer_id' => $writer->id,
            ],
            [
                'title' => 'Seven Tech Luncurkan Platform Digital Terbaru untuk Industri Fashion',
                'slug' => 'seven-tech-platform-digital-fashion',
                'author' => 'Divisi Teknologi',
                'excerpt' => 'Platform digital inovatif Seven Tech hadir untuk memberikan solusi terpadu dalam pengelolaan bisnis fashion modern.',
                'body' => 'Seven Tech, unit bisnis Seven INC di bidang teknologi, dengan bangga meluncurkan platform digital terbaru yang dirancang khusus untuk industri fashion. Platform ini mengintegrasikan berbagai fitur seperti inventory management, order tracking, dan customer relationship management dalam satu sistem yang mudah digunakan dan efisien.',
                'status' => 'approved',
                'is_published' => true,
                'published_at' => now()->subDays(7),
                'category_id' => $categories->where('slug', 'inovasi-produk')->first()->id,
                'writer_id' => $writer->id,
            ],
            [
                'title' => 'Seven INC Berhasil Meraih Sertifikasi ISO 9001:2015',
                'slug' => 'seven-inc-sertifikasi-iso-9001',
                'author' => 'Manajemen Seven INC',
                'excerpt' => 'Pencapaian penting: Seven INC resmi meraih sertifikasi ISO 9001:2015 sebagai bukti komitmen kami terhadap kualitas.',
                'body' => 'Sebagai bukti komitmen kami terhadap kualitas dan profesionalisme, Seven INC berhasil meraih sertifikasi internasional ISO 9001:2015. Sertifikasi ini mencerminkan dedikasi kami dalam menerapkan sistem manajemen kualitas yang ketat di setiap aspek operasional perusahaan.',
                'status' => 'approved',
                'is_published' => true,
                'published_at' => now()->subDays(1),
                'category_id' => $categories->where('slug', 'berita-perusahaan')->first()->id,
                'writer_id' => $writer->id,
            ],
            [
                'title' => 'Kisah Sukses: Bagaimana Tim Seven INC Berkembang Bersama',
                'slug' => 'kisah-sukses-tim-seven-inc',
                'author' => 'Departemen Human Resource',
                'excerpt' => 'Testimoni nyata dari tim Seven INC tentang perjalanan pengembangan karir dan pengalaman bekerja di perusahaan kami.',
                'body' => 'Perjalanan setiap individu di Seven INC adalah cerita sukses yang menginspirasi. Dari posisi awal hingga promosi, setiap karyawan memiliki kesempatan yang sama untuk berkembang dan mencapai impian karir mereka. Budaya kerja kami yang mendukung, rekan kerja yang solid, dan pelatihan berkelanjutan menciptakan lingkungan yang sempurna untuk pertumbuhan profesional.',
                'status' => 'approved',
                'is_published' => true,
                'published_at' => now()->subDays(2),
                'category_id' => $categories->where('slug', 'testimoni-cerita-sukses')->first()->id,
                'writer_id' => $writer->id,
            ],
        ];

        foreach ($newsData as $news) {
            News::updateOrCreate(
                ['slug' => $news['slug']],
                $news
            );
        }
    }
}
