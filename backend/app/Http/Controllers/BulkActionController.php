<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BulkActionController extends Controller
{
    /**
     * Bulk delete news
     */
    public function deleteNews(Request $request)
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'required|integer|exists:news,id',
            ]);

            $ids = $validated['ids'];
            $count = count($ids);

            // Get titles for log
            $newsList = News::whereIn('id', $ids)->pluck('title', 'id');

            // Soft delete
            News::whereIn('id', $ids)->delete();

            // Log activity
            ActivityLogService::log(
                action: 'bulk_delete',
                modelType: 'news',
                modelId: null,
                description: "Bulk deleted {$count} news items",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => "Successfully deleted {$count} news items",
                'deleted_count' => $count,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Bulk publish news
     */
    public function publishNews(Request $request)
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'required|integer|exists:news,id',
            ]);

            $ids = $validated['ids'];
            $count = count($ids);

            // Update to published
            News::whereIn('id', $ids)->update([
                'is_published' => true,
                'published_at' => now(),
            ]);

            // Log activity
            ActivityLogService::log(
                action: 'bulk_publish',
                modelType: 'news',
                modelId: null,
                description: "Bulk published {$count} news items",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => "Successfully published {$count} news items",
                'published_count' => $count,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Bulk unpublish news
     */
    public function unpublishNews(Request $request)
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'required|integer|exists:news,id',
            ]);

            $ids = $validated['ids'];
            $count = count($ids);

            // Update to unpublished
            News::whereIn('id', $ids)->update([
                'is_published' => false,
                'published_at' => null,
            ]);

            // Log activity
            ActivityLogService::log(
                action: 'bulk_unpublish',
                modelType: 'news',
                modelId: null,
                description: "Bulk unpublished {$count} news items",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => "Successfully unpublished {$count} news items",
                'unpublished_count' => $count,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Bulk approve news
     */
    public function approveNews(Request $request)
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'required|integer|exists:news,id',
            ]);

            $ids = $validated['ids'];
            $adminId = $request->user()->id;
            $count = count($ids);

            // Update to approved
            News::whereIn('id', $ids)->update([
                'status' => 'approved',
                'approved_by' => $adminId,
                'approved_at' => now(),
            ]);

            // Log activity
            ActivityLogService::log(
                action: 'bulk_approve',
                modelType: 'news',
                modelId: null,
                description: "Bulk approved {$count} news items",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => "Successfully approved {$count} news items",
                'approved_count' => $count,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Bulk update category
     */
    public function updateCategory(Request $request)
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'required|integer|exists:news,id',
                'category_id' => 'required|integer|exists:categories,id',
            ]);

            $ids = $validated['ids'];
            $categoryId = $validated['category_id'];
            $count = count($ids);

            // Update category
            News::whereIn('id', $ids)->update([
                'category_id' => $categoryId,
            ]);

            // Log activity
            ActivityLogService::log(
                action: 'bulk_update',
                modelType: 'news',
                modelId: null,
                description: "Bulk updated category for {$count} news items",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => "Successfully updated category for {$count} news items",
                'updated_count' => $count,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
