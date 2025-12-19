<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InternshipApplication;
use Illuminate\Http\Request;

class InternshipDashboardController extends Controller
{
    /**
     * Get dashboard data (stats + divisions)
     */
    public function getDashboard()
    {
        try {
            // Get statistics from database
            $stats = [
                'total' => InternshipApplication::count(),
                'pending' => InternshipApplication::where('status', 'pending')->count(),
                'ditinjau' => InternshipApplication::where('status', 'ditinjau')->count(),
                'diterima' => InternshipApplication::where('status', 'diterima')->count()
            ];

            // All 18 divisions (positions)
            $allDivisions = [
                'Administrasi',
                'Animasi',
                'Content Planner',
                'Content Writer',
                'Desain Grafis',
                'Digital Market',
                'Host / Presenter',
                'Human Resource',
                'Las',
                'Marketing & Sales',
                'Public Relation',
                'Photographer Videographer',
                'Programmer',
                'Project Manager',
                'Social Media Specialist',
                'TikTok Creator',
                'UI / UX Designer',
                'Voice Over Talent'
            ];

            // Get count of applications per division from database
            $divisions = [];
            foreach ($allDivisions as $index => $divisionName) {
                $count = InternshipApplication::where('program_magang_pilihan', $divisionName)->count();
                $divisions[] = [
                    'id' => $index + 1,
                    'nama' => $divisionName,
                    'count' => $count
                ];
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'stats' => $stats,
                    'divisions' => $divisions
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}
