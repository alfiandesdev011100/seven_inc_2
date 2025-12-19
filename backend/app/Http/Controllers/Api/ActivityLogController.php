<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Get activity logs - Admin only
     */
    public function index(Request $request)
    {
        $query = ActivityLog::query();

        // Filter by action
        if ($request->has('action')) {
            $query->byAction($request->action);
        }

        // Filter by model type
        if ($request->has('model_type')) {
            $query->byModel($request->model_type);
        }

        // Filter by user
        if ($request->has('user_id')) {
            $query->byUser($request->user_id);
        }

        // Filter by user type
        if ($request->has('user_type')) {
            $query->where('user_type', $request->user_type);
        }

        // Date range filter
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->dateBetween(
                \Carbon\Carbon::parse($request->date_from),
                \Carbon\Carbon::parse($request->date_to)
            );
        }

        // Pagination
        $perPage = $request->input('per_page', 50);
        $logs = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => [
                'list' => $logs->items(),
                'meta' => [
                    'current_page' => $logs->currentPage(),
                    'per_page' => $logs->perPage(),
                    'total' => $logs->total(),
                    'last_page' => $logs->lastPage(),
                ]
            ]
        ], 200);
    }

    /**
     * Get logs for specific user - User bisa lihat activity mereka sendiri
     */
    public function myActivity(Request $request)
    {
        $user = $request->user();
        $userType = $user instanceof \App\Models\Admin ? 'admin' : 'writer';

        $query = ActivityLog::where('user_id', $user->id)
            ->where('user_type', $userType)
            ->orderBy('created_at', 'desc');

        // Filter by action
        if ($request->has('action')) {
            $query->byAction($request->action);
        }

        $perPage = $request->input('per_page', 20);
        $logs = $query->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => [
                'list' => $logs->items(),
                'meta' => [
                    'current_page' => $logs->currentPage(),
                    'per_page' => $logs->perPage(),
                    'total' => $logs->total(),
                    'last_page' => $logs->lastPage(),
                ]
            ]
        ], 200);
    }

    /**
     * Get logs for specific model (news, category, etc)
     */
    public function modelHistory(Request $request, $modelType, $modelId)
    {
        $logs = ActivityLog::where('model_type', $modelType)
            ->where('model_id', $modelId)
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json([
            'status' => true,
            'data' => [
                'list' => $logs->items(),
                'meta' => [
                    'current_page' => $logs->currentPage(),
                    'per_page' => $logs->perPage(),
                    'total' => $logs->total(),
                    'last_page' => $logs->lastPage(),
                ]
            ]
        ], 200);
    }

    /**
     * Clear old logs (older than X days) - Maintenance task
     */
    public function clearOldLogs(Request $request)
    {
        $request->validate([
            'days' => 'required|integer|min:7',
        ]);

        $daysAgo = now()->subDays($request->days);
        $deleted = ActivityLog::where('created_at', '<', $daysAgo)->delete();

        return response()->json([
            'status' => true,
            'message' => "Deleted {$deleted} old activity logs",
        ]);
    }
}
