<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InternshipProgram;

class InternshipProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            [
                'title' => 'Programmer (Backend)',
                'description' => 'Mengembangkan backend aplikasi menggunakan Laravel, API RESTful, dan database design. Peserta akan bekerja pada proyek-proyek nyata dan belajar best practices dalam development.',
                'duration' => '6 bulan',
                'allowance' => 'Rp 1.500.000',
                'requirements' => '- Memahami PHP & Laravel\n- Familiar dengan database relasional\n- Bisa basic API development\n- Team player',
                'is_active' => true,
            ],
            [
                'title' => 'Frontend Developer',
                'description' => 'Mengembangkan antarmuka web dan mobile menggunakan React, Vue.js, dan modern CSS. Fokus pada UX/UI dan responsive design untuk berbagai perangkat.',
                'duration' => '5 bulan',
                'allowance' => 'Rp 1.200.000',
                'requirements' => '- Mengerti HTML, CSS, JavaScript\n- Familiar dengan React atau Vue.js\n- Bisa responsive design\n- Portfolio atau GitHub',
                'is_active' => true,
            ],
            [
                'title' => 'UI/UX Designer',
                'description' => 'Merancang user interface dan user experience yang menarik dan fungsional. Bekerja dengan design tools seperti Figma dan berkolaborasi dengan tim development.',
                'duration' => '4 bulan',
                'allowance' => 'Rp 1.000.000',
                'requirements' => '- Menguasai Figma atau Sketch\n- Bisa design thinking process\n- Portfolio design minimal 3 proyek\n- Communication skills',
                'is_active' => true,
            ],
            [
                'title' => 'Content Writer & Strategist',
                'description' => 'Membuat konten berkualitas untuk website, blog, dan social media. Fokus pada SEO optimization dan content strategy untuk engagement maksimal.',
                'duration' => '3 bulan',
                'allowance' => 'Rp 800.000',
                'requirements' => '- Kemampuan menulis bahasa Indonesia & English\n- Paham SEO basics\n- Familiar dengan CMS\n- Portfolio artikel',
                'is_active' => true,
            ],
            [
                'title' => 'Digital Marketing',
                'description' => 'Mengelola campaign digital marketing, social media strategy, dan analytics. Belajar tentang paid ads, organic growth, dan conversion optimization.',
                'duration' => '4 bulan',
                'allowance' => 'Rp 1.000.000',
                'requirements' => '- Pemahaman digital marketing basics\n- Social media marketing knowledge\n- Analytics & tracking\n- Problem-solving skills',
                'is_active' => true,
            ],
            [
                'title' => 'QA / Testing',
                'description' => 'Melakukan testing dan quality assurance pada aplikasi web dan mobile. Belajar manual testing, automation testing, dan bug reporting procedures.',
                'duration' => '3 bulan',
                'allowance' => 'Rp 900.000',
                'requirements' => '- Detail oriented\n- Logical thinking\n- Familiar dengan testing tools\n- Communication skills',
                'is_active' => true,
            ],
            [
                'title' => 'DevOps / System Administrator',
                'description' => 'Mengelola infrastruktur server, deployment, dan monitoring sistem. Belajar tentang Linux, Docker, Kubernetes, dan cloud services.',
                'duration' => '5 bulan',
                'allowance' => 'Rp 1.300.000',
                'requirements' => '- Mengerti Linux basics\n- Familiar dengan command line\n- Database knowledge\n- Problem-solving',
                'is_active' => true,
            ],
            [
                'title' => 'Data Analyst',
                'description' => 'Menganalisa data bisnis dan membuat insights untuk decision making. Menggunakan tools seperti Excel, SQL, dan visualization tools.',
                'duration' => '4 bulan',
                'allowance' => 'Rp 1.100.000',
                'requirements' => '- Menguasai Excel & SQL\n- Statistical thinking\n- Familiar dengan data visualization\n- Analytical mindset',
                'is_active' => true,
            ],
            [
                'title' => 'Project Manager',
                'description' => 'Mengelola jalannya project dari planning sampai completion. Koordinasi tim, manage timeline, dan ensure quality delivery.',
                'duration' => '3 bulan',
                'allowance' => 'Rp 1.400.000',
                'requirements' => '- Leadership skills\n- Familiar dengan agile/scrum\n- Communication excellence\n- Organizational skills',
                'is_active' => true,
            ],
        ];

        foreach ($programs as $program) {
            InternshipProgram::create($program);
        }

        $this->command->info("✅ InternshipProgramSeeder: " . count($programs) . " programs created!");
    }
}
