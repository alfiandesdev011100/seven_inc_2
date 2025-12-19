<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\News;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    /**
     * Get comments for a news article
     */
    public function index(Request $request, $newsId)
    {
        try {
            $perPage = (int)($request->integer('per_page') ?: 20);
            $page = $request->integer('page', 1);
            $status = $request->get('status', 'approved'); // approved, pending, spam

            $news = News::findOrFail($newsId);

            $query = Comment::byNews($newsId)->notSpam();

            if ($status === 'pending') {
                $query->pending();
            } elseif ($status === 'spam') {
                $query = Comment::byNews($newsId)->spam();
            } else {
                $query->approved();
            }

            $comments = $query->orderBy('created_at', 'desc')
                              ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'status' => true,
                'data' => [
                    'list' => $comments->items(),
                    'meta' => [
                        'current_page' => $comments->currentPage(),
                        'per_page' => $comments->perPage(),
                        'total' => $comments->total(),
                        'last_page' => $comments->lastPage(),
                    ]
                ]
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['status' => false, 'message' => 'News not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Create comment on news (Public or Authenticated)
     */
    public function store(Request $request, $newsId)
    {
        try {
            $news = News::findOrFail($newsId);

            if (!$news->is_published) {
                return response()->json(['status' => false, 'message' => 'News not published'], 404);
            }

            $v = Validator::make($request->all(), [
                'content' => 'required|string|min:3|max:1000',
            ]);

            if ($v->fails()) {
                return response()->json(['status' => false, 'errors' => $v->errors()], 422);
            }

            // Get authenticated user if exists
            $user = \Auth::guard('sanctum')->user();
            $userId = $user?->id;
            $userType = $user ? (class_basename($user) === 'Writer' ? 'writer' : 'admin') : 'anonymous';

            // Check if it's spam (simple check - can be enhanced)
            $isSpam = $this->detectSpam($request->input('content'));

            $comment = Comment::create([
                'news_id' => $newsId,
                'user_id' => $userId,
                'user_type' => $userType,
                'content' => $request->input('content'),
                'is_approved' => false, // Require moderation
                'is_spam' => $isSpam,
            ]);

            // Log activity
            ActivityLogService::log(
                action: 'create_comment',
                modelType: 'comment',
                modelId: $comment->id,
                description: "Created comment on news: {$news->title}",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => 'Comment created and awaiting approval',
                'data' => $comment
            ], 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['status' => false, 'message' => 'News not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Approve comment (Admin only)
     */
    public function approve(Request $request, $commentId)
    {
        try {
            $comment = Comment::findOrFail($commentId);

            $comment->update([
                'is_approved' => true,
                'approved_at' => now(),
                'is_spam' => false,
            ]);

            ActivityLogService::log(
                action: 'approve_comment',
                modelType: 'comment',
                modelId: $commentId,
                description: "Approved comment on news",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => 'Comment approved',
                'data' => $comment
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['status' => false, 'message' => 'Comment not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Mark comment as spam
     */
    public function markSpam(Request $request, $commentId)
    {
        try {
            $comment = Comment::findOrFail($commentId);

            $comment->update(['is_spam' => true]);

            ActivityLogService::log(
                action: 'mark_spam',
                modelType: 'comment',
                modelId: $commentId,
                description: "Marked comment as spam",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => 'Comment marked as spam',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['status' => false, 'message' => 'Comment not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete comment
     */
    public function destroy(Request $request, $commentId)
    {
        try {
            $comment = Comment::findOrFail($commentId);

            ActivityLogService::log(
                action: 'delete_comment',
                modelType: 'comment',
                modelId: $commentId,
                description: "Deleted comment",
                request: $request
            );

            $comment->delete();

            return response()->json(['status' => true, 'message' => 'Comment deleted'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['status' => false, 'message' => 'Comment not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get pending comments for moderation
     */
    public function pending(Request $request)
    {
        try {
            $perPage = (int)($request->integer('per_page') ?: 20);
            $page = $request->integer('page', 1);

            $comments = Comment::pending()
                               ->notSpam()
                               ->orderBy('created_at', 'asc')
                               ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'status' => true,
                'data' => [
                    'list' => $comments->items(),
                    'meta' => [
                        'current_page' => $comments->currentPage(),
                        'per_page' => $comments->perPage(),
                        'total' => $comments->total(),
                        'last_page' => $comments->lastPage(),
                    ]
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Simple spam detection (can be enhanced with external service)
     */
    private function detectSpam($content)
    {
        // Simple heuristics
        $spamKeywords = ['viagra', 'casino', 'lottery', 'click here', 'http://', 'https://'];

        foreach ($spamKeywords as $keyword) {
            if (stripos($content, $keyword) !== false) {
                return true;
            }
        }

        // Check for excessive URLs
        if (preg_match_all('/https?:\/\//', $content) > 2) {
            return true;
        }

        // Check for excessive caps
        if (strlen($content) > 10 && (strlen(preg_replace('/[^A-Z]/', '', $content)) / strlen($content)) > 0.5) {
            return true;
        }

        return false;
    }
}
