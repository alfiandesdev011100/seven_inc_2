<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class NewsController extends Controller
{
    // ===== Helpers =====
    private function serialize(?News $n): ?array
    {
        if (!$n) return null;

        return [
            'id'           => $n->id,
            'title'        => $n->title,
            'slug'         => $n->slug,
            'excerpt'      => $n->excerpt,
            'body'         => $n->body,
            'cover_url'    => $n->cover_url,
            'is_published' => (bool) $n->is_published,
            'published_at' => optional($n->published_at)->toIso8601String(),
            'updated_at'   => optional($n->updated_at)->toIso8601String(),
            'author'       => $n->author,
            'status'       => $n->status ?? 'draft',
            'approved_by'  => $n->approved_by,
            'approved_at'  => optional($n->approved_at)->toIso8601String(),
            'rejection_reason' => $n->rejection_reason,
        ];
    }

    private function findByIdOrSlug(string $idOrSlug): ?News
    {
        return is_numeric($idOrSlug)
            ? News::find($idOrSlug)
            : News::where('slug', $idOrSlug)->first();
    }

    // ===== Public Endpoints =====

    public function index(Request $request)
    {
        $perPage = (int)($request->integer('per_page') ?: 9);
        $q = trim((string)$request->get('q', ''));

        $base = News::published(); // Hanya yang sudah publish

        if ($q !== '') {
            $base->where('title', 'like', '%' . $q . '%');
        }

        $featured = (clone $base)->ordered()->first();

        $listQuery = (clone $base)
            ->when($featured, fn($qq) => $qq->where('id', '!=', $featured->id))
            ->ordered();

        $p = $listQuery->paginate($perPage)->appends($request->query());

        return response()->json([
            'status' => true,
            'data'   => [
                'featured' => $this->serialize($featured),
                'list'     => collect($p->items())->map(fn($n) => $this->serialize($n))->values(),
                'meta'     => [
                    'current_page' => $p->currentPage(),
                    'per_page'     => $p->perPage(),
                    'total'        => $p->total(),
                    'last_page'    => $p->lastPage(),
                ],
            ],
        ], 200);
    }

    public function show(string $idOrSlug)
    {
        $news = $this->findByIdOrSlug($idOrSlug);
        if (!$news || !$news->is_published) {
            return response()->json(['status' => false, 'message' => 'Not found'], 404);
        }

        return response()->json(['status' => true, 'data' => $this->serialize($news)], 200);
    }

    // ===== Admin Endpoints (Auth Required) =====

    // [BARU] Untuk tabel di halaman admin (Lihat semua: Draft + Published)
    public function adminIndex(Request $request)
    {
        try {
            $perPage = (int)($request->integer('per_page') ?: 10);
            $q = trim((string)$request->get('search', ''));
            $status = $request->get('status');
            $categoryId = $request->get('category_id');
            $writerId = $request->get('writer_id');
            $sortBy = $request->get('sort', 'created_at');
            $order = $request->get('order', 'desc');
            $dateFrom = $request->get('date_from');
            $dateTo = $request->get('date_to');

            $query = News::query();

            // Apply filters
            if (!empty($q)) {
                $query->search($q);
            }

            if (!empty($status)) {
                $query->status($status);
            }

            if (!empty($categoryId)) {
                $query->byCategory($categoryId);
            }

            if (!empty($writerId)) {
                $query->byWriter($writerId);
            }

            if (!empty($dateFrom) || !empty($dateTo)) {
                $query->dateRange($dateFrom, $dateTo);
            }

            // Apply sorting
            $query->sortBy($sortBy, $order);

            $p = $query->paginate($perPage);

            return response()->json([
                'status' => true,
                'data'   => [
                    'list' => collect($p->items())->map(fn($n) => $this->serialize($n))->values(),
                    'meta' => [
                        'current_page' => $p->currentPage(),
                        'last_page'    => $p->lastPage(),
                        'total'        => $p->total(),
                    ],
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'title'        => 'required|string|max:255',
            'excerpt'      => 'nullable|string|max:500',
            'body'         => 'required|string',
            'cover'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'is_published' => 'nullable|boolean',
            'author'       => 'nullable|string|max:120',
        ]);

        if ($v->fails()) {
            return response()->json(['status' => false, 'errors' => $v->errors()], 422);
        }

        $news = new News($v->validated());

        if ($request->hasFile('cover')) {
            $news->cover_path = $request->file('cover')->store('news', 'public');
        }

        $news->save(); // Slug & Published_at handled by Model Hook

        // Log activity
        ActivityLogService::log(
            action: 'create',
            modelType: 'news',
            modelId: $news->id,
            description: "Created news: {$news->title}",
            request: $request
        );

        return response()->json([
            'status'  => true,
            'message' => 'News created',
            'data'    => $this->serialize($news),
        ], 201);
    }

    public function update(Request $request, string $idOrSlug)
    {
        $news = $this->findByIdOrSlug($idOrSlug);
        if (!$news) return response()->json(['status' => false, 'message' => 'Not found'], 404);

        $v = Validator::make($request->all(), [
            'title'        => 'sometimes|required|string|max:255',
            'excerpt'      => 'sometimes|nullable|string|max:500',
            'body'         => 'sometimes|required|string',
            'cover'        => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'is_published' => 'sometimes|boolean',
            'author'       => 'sometimes|nullable|string|max:120',
        ]);

        if ($v->fails()) {
            return response()->json(['status' => false, 'errors' => $v->errors()], 422);
        }

        // Capture old data before update
        $oldData = $news->only(['title', 'excerpt', 'body', 'is_published', 'author']);

        // Handle is_published manual conversion if needed
        $data = $v->validated();
        if ($request->has('is_published')) {
            $data['is_published'] = filter_var($request->input('is_published'), FILTER_VALIDATE_BOOLEAN);
        }

        $news->fill($data);

        if ($request->hasFile('cover')) {
            if ($news->cover_path && Storage::disk('public')->exists($news->cover_path)) {
                Storage::disk('public')->delete($news->cover_path);
            }
            $news->cover_path = $request->file('cover')->store('news', 'public');
        }

        $news->save();

        // Log activity
        $changes = ActivityLogService::captureChanges($oldData, $news->only(['title', 'excerpt', 'body', 'is_published', 'author']));
        ActivityLogService::log(
            action: 'update',
            modelType: 'news',
            modelId: $news->id,
            changes: $changes,
            description: "Updated news: {$news->title}",
            request: $request
        );

        return response()->json([
            'status'  => true,
            'message' => 'News updated',
            'data'    => $this->serialize($news),
        ], 200);
    }

    public function destroy(Request $request, string $idOrSlug)
    {
        $news = $this->findByIdOrSlug($idOrSlug);
        if (!$news) return response()->json(['status' => false, 'message' => 'Not found'], 404);

        if ($news->cover_path && Storage::disk('public')->exists($news->cover_path)) {
            Storage::disk('public')->delete($news->cover_path);
        }

        // Log activity before delete
        ActivityLogService::log(
            action: 'delete',
            modelType: 'news',
            modelId: $news->id,
            description: "Deleted news: {$news->title}",
            request: $request
        );

        $news->delete(); // Soft delete jika trait aktif, atau force delete

        return response()->json(['status' => true, 'message' => 'News deleted'], 200);
    }

    public function togglePublish(Request $request, string $idOrSlug)
    {
        $news = $this->findByIdOrSlug($idOrSlug);
        if (!$news) return response()->json(['status' => false, 'message' => 'Not found'], 404);

        $news->is_published = (bool)$request->boolean('is_published');
        $news->save();

        return response()->json([
            'status'  => true,
            'message' => 'Publish status updated',
            'data'    => $this->serialize($news),
        ], 200);
    }

    // ===== WRITER ENDPOINTS (Writer Portal) =====

    /**
     * Get Writer's Own News
     */
    public function writerIndex(Request $request)
    {
        try {
            $writer = \Auth::guard('sanctum')->user();

            if (!$writer || !$writer->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $perPage = (int)($request->integer('per_page') ?: 10);
            $q = trim((string)$request->get('q', ''));

            // Query news by writer_id
            $query = News::where('author', $writer->name);

            if ($q !== '') {
                $query->where('title', 'like', '%' . $q . '%');
            }

            $query->orderByDesc('updated_at');
            $p = $query->paginate($perPage);

            return response()->json([
                'status' => true,
                'message' => 'Writer news retrieved successfully',
                'data' => [
                    'list' => collect($p->items())->map(fn($n) => $this->serialize($n))->values(),
                    'meta' => [
                        'current_page' => $p->currentPage(),
                        'last_page' => $p->lastPage(),
                        'total' => $p->total(),
                    ],
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to retrieve news: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create News as Writer (Auto Draft)
     */
    public function writerStore(Request $request)
    {
        try {
            $writer = \Auth::guard('sanctum')->user();

            if (!$writer || !$writer->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $v = Validator::make($request->all(), [
                'title'   => 'required|string|max:255',
                'excerpt' => 'nullable|string|max:500',
                'body'    => 'required|string',
                'cover'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            ]);

            if ($v->fails()) {
                return response()->json(['status' => false, 'errors' => $v->errors()], 422);
            }

            $news = new News($v->validated());
            $news->author = $writer->name; // Set writer name as author
            $news->is_published = false; // Always draft for writer
            $news->published_at = null;

            if ($request->hasFile('cover')) {
                $news->cover_path = $request->file('cover')->store('news', 'public');
            }

            $news->save();

            return response()->json([
                'status' => true,
                'message' => 'News created as draft',
                'data' => $this->serialize($news),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to create news: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update Writer's Own News
     */
    public function writerUpdate(Request $request, string $idOrSlug)
    {
        try {
            $writer = \Auth::guard('sanctum')->user();

            if (!$writer || !$writer->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $news = $this->findByIdOrSlug($idOrSlug);

            if (!$news) {
                return response()->json(['status' => false, 'message' => 'News not found'], 404);
            }

            // Check ownership
            if ($news->author !== $writer->name) {
                return response()->json([
                    'status' => false,
                    'message' => 'You can only edit your own news',
                ], 403);
            }

            $v = Validator::make($request->all(), [
                'title'   => 'sometimes|required|string|max:255',
                'excerpt' => 'sometimes|nullable|string|max:500',
                'body'    => 'sometimes|required|string',
                'cover'   => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            ]);

            if ($v->fails()) {
                return response()->json(['status' => false, 'errors' => $v->errors()], 422);
            }

            $news->fill($v->validated());

            if ($request->hasFile('cover')) {
                if ($news->cover_path && Storage::disk('public')->exists($news->cover_path)) {
                    Storage::disk('public')->delete($news->cover_path);
                }
                $news->cover_path = $request->file('cover')->store('news', 'public');
            }

            $news->save();

            return response()->json([
                'status' => true,
                'message' => 'News updated successfully',
                'data' => $this->serialize($news),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update news: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete Writer's Own News
     */
    public function writerDestroy(string $idOrSlug)
    {
        try {
            $writer = \Auth::guard('sanctum')->user();

            if (!$writer || !$writer->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $news = $this->findByIdOrSlug($idOrSlug);

            if (!$news) {
                return response()->json(['status' => false, 'message' => 'News not found'], 404);
            }

            // Check ownership
            if ($news->author !== $writer->name) {
                return response()->json([
                    'status' => false,
                    'message' => 'You can only delete your own news',
                ], 403);
            }

            if ($news->cover_path && Storage::disk('public')->exists($news->cover_path)) {
                Storage::disk('public')->delete($news->cover_path);
            }

            $news->delete();

            return response()->json([
                'status' => true,
                'message' => 'News deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete news: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get soft-deleted news
     */
    public function deletedNews(Request $request)
    {
        try {
            $perPage = (int)($request->integer('per_page') ?: 10);
            $page = $request->integer('page', 1);

            $deleted = News::onlyTrashed()
                ->orderBy('deleted_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'status' => true,
                'data'   => [
                    'list' => collect($deleted->items())->map(fn($n) => $this->serialize($n))->values(),
                    'meta' => [
                        'current_page' => $deleted->currentPage(),
                        'last_page'    => $deleted->lastPage(),
                        'total'        => $deleted->total(),
                    ],
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Restore soft-deleted news
     */
    public function restoreNews(Request $request, string $id)
    {
        try {
            $news = News::onlyTrashed()->findOrFail($id);
            $news->restore();

            ActivityLogService::log(
                action: 'restore',
                modelType: 'news',
                modelId: $news->id,
                description: "Restored news: {$news->title}",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => 'News restored successfully',
                'data'    => $this->serialize($news),
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['status' => false, 'message' => 'News not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Permanently delete news (force delete)
     */
    public function forceDelete(Request $request, string $id)
    {
        try {
            $news = News::onlyTrashed()->findOrFail($id);

            if ($news->cover_path && Storage::disk('public')->exists($news->cover_path)) {
                Storage::disk('public')->delete($news->cover_path);
            }

            $news->forceDelete();

            ActivityLogService::log(
                action: 'force_delete',
                modelType: 'news',
                modelId: $id,
                description: "Permanently deleted news: {$news->title}",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => 'News permanently deleted',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['status' => false, 'message' => 'News not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Schedule news publish for later
     */
    public function schedulePublish(Request $request, string $idOrSlug)
    {
        try {
            $v = Validator::make($request->all(), [
                'scheduled_publish_at' => 'required|date|after:now',
            ]);

            if ($v->fails()) {
                return response()->json(['status' => false, 'errors' => $v->errors()], 422);
            }

            $news = $this->findByIdOrSlug($idOrSlug);

            if (!$news) {
                return response()->json(['status' => false, 'message' => 'News not found'], 404);
            }

            // Check if approved
            if ($news->status !== 'approved') {
                return response()->json([
                    'status' => false,
                    'message' => 'Only approved news can be scheduled'
                ], 403);
            }

            $news->update([
                'is_scheduled' => true,
                'scheduled_publish_at' => $v->validated()['scheduled_publish_at'],
            ]);

            ActivityLogService::log(
                action: 'schedule_publish',
                modelType: 'news',
                modelId: $news->id,
                description: "Scheduled publish for news: {$news->title}",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => 'News scheduled for publishing',
                'data' => $this->serialize($news),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Cancel scheduled publish
     */
    public function cancelSchedule(Request $request, string $idOrSlug)
    {
        try {
            $news = $this->findByIdOrSlug($idOrSlug);

            if (!$news) {
                return response()->json(['status' => false, 'message' => 'News not found'], 404);
            }

            if (!$news->is_scheduled) {
                return response()->json([
                    'status' => false,
                    'message' => 'News is not scheduled'
                ], 400);
            }

            $news->update([
                'is_scheduled' => false,
                'scheduled_publish_at' => null,
            ]);

            ActivityLogService::log(
                action: 'cancel_schedule',
                modelType: 'news',
                modelId: $news->id,
                description: "Cancelled scheduled publish for news: {$news->title}",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => 'Scheduled publish cancelled',
                'data' => $this->serialize($news),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
