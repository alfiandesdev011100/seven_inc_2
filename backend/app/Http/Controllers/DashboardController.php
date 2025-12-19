<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Admin;
use App\Models\Writer;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function stats(Request $request)
    {
        try {
            // Count statistics
            $totalNews = News::count();
            $draftNews = News::where('status', 'draft')->count();
            $pendingApproval = News::where('status', 'pending')->count();
            $approvedNews = News::where('status', 'approved')->count();
            $rejectedNews = News::where('status', 'rejected')->count();

            $totalAdmins = Admin::count();
            $totalWriters = Writer::count();

            // Recent activity (last 10 logs)
            $recentActivity = \App\Models\ActivityLog::query()
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            // News per writer (top 5)
            $topWriters = Writer::withCount('news')
                ->orderBy('news_count', 'desc')
                ->limit(5)
                ->get(['id', 'name', 'email']);

            // Recent news (last 10)
            $recentNews = News::query()
                ->with('writer')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            // Statistics by month (last 6 months)
            $newsPerMonth = News::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('month')
                ->orderBy('month', 'asc')
                ->get();

            return response()->json([
                'status' => true,
                'data' => [
                    'summary' => [
                        'total_news' => $totalNews,
                        'total_admins' => $totalAdmins,
                        'total_writers' => $totalWriters,
                    ],
                    'news_status' => [
                        'draft' => $draftNews,
                        'pending_approval' => $pendingApproval,
                        'approved' => $approvedNews,
                        'rejected' => $rejectedNews,
                    ],
                    'recent_activity' => $recentActivity,
                    'top_writers' => $topWriters,
                    'recent_news' => $recentNews,
                    'news_per_month' => $newsPerMonth,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get category statistics
     */
    public function categoryStats(Request $request)
    {
        try {
            $stats = \App\Models\Category::query()
                ->withCount('news')
                ->orderBy('news_count', 'desc')
                ->get();

            return response()->json([
                'status' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get writer statistics
     */
    public function writerStats(Request $request)
    {
        try {
            $stats = Writer::query()
                ->withCount('news')
                ->with([
                    'news' => function ($query) {
                        $query->selectRaw('writer_id, COUNT(*) as count, SUM(CASE WHEN status = "approved" THEN 1 ELSE 0 END) as approved_count');
                    }
                ])
                ->orderBy('created_at', 'desc')
                ->get();

            // Transform response
            $data = $stats->map(function ($writer) {
                return [
                    'id' => $writer->id,
                    'name' => $writer->name,
                    'email' => $writer->email,
                    'total_news' => $writer->news_count,
                    'approved_news' => $writer->news->count() > 0 ? $writer->news[0]->approved_count : 0,
                    'created_at' => $writer->created_at,
                ];
            });

            return response()->json([
                'status' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
