<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class MediaController extends Controller
{
    /**
     * Upload media file untuk artikel
     */
    public function upload(Request $request)
    {
        try {
            $validated = $request->validate([
                'news_id' => 'required|exists:news,id',
                'file' => 'required|file|max:50000', // 50MB max
                'position_in_article' => 'nullable|string|in:hero,body,gallery,thumbnail',
                'caption' => 'nullable|string|max:255',
                'alt_text' => 'nullable|string|max:255',
            ]);

            // Get the uploaded file
            $file = $request->file('file');
            
            // Determine media type
            $mimeType = $file->getMimeType();
            $mediaType = 'document';
            
            if (str_starts_with($mimeType, 'image/')) {
                $mediaType = 'image';
            } elseif (str_starts_with($mimeType, 'video/')) {
                $mediaType = 'video';
            }

            // Store the file
            $path = $file->store('media/' . date('Y/m/d'), 'public');
            
            // Create media record
            $media = Media::create([
                'news_id' => $validated['news_id'],
                'media_type' => $mediaType,
                'file_path' => $path,
                'file_size' => $file->getSize(),
                'mime_type' => $mimeType,
                'original_filename' => $file->getClientOriginalName(),
                'position_in_article' => $validated['position_in_article'] ?? 'body',
                'caption' => $validated['caption'] ?? null,
                'alt_text' => $validated['alt_text'] ?? null,
                'uploaded_by_writer_id' => auth('sanctum')->id(),
                'uploaded_at' => now(),
                'is_approved' => false, // Default pending approval
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Media uploaded successfully, waiting for admin approval',
                'data' => $media,
                'file_url' => asset('storage/' . $path),
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get media by news id
     */
    public function getByNews($newsId)
    {
        try {
            $news = News::findOrFail($newsId);
            
            $media = $news->media()
                ->orderBy('position_in_article')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $media,
                'total' => $media->count(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all pending media (for admin approval)
     */
    public function getPending(Request $request)
    {
        try {
            $query = Media::where('is_approved', false)
                ->with(['news', 'uploadedBy'])
                ->orderByDesc('uploaded_at');

            // Filter by news id if provided
            if ($request->has('news_id')) {
                $query->where('news_id', $request->news_id);
            }

            // Filter by media type if provided
            if ($request->has('type')) {
                $query->where('media_type', $request->type);
            }

            $media = $query->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $media,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch pending media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin approve media
     */
    public function approve(Request $request, $mediaId)
    {
        try {
            $validated = $request->validate([
                'caption' => 'nullable|string|max:255',
                'alt_text' => 'nullable|string|max:255',
            ]);

            $media = Media::findOrFail($mediaId);

            $media->update([
                'is_approved' => true,
                'approved_by_admin_id' => auth('sanctum')->id(),
                'approved_at' => now(),
                'caption' => $validated['caption'] ?? $media->caption,
                'alt_text' => $validated['alt_text'] ?? $media->alt_text,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Media approved successfully',
                'data' => $media,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Approval failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin reject media
     */
    public function reject(Request $request, $mediaId)
    {
        try {
            $validated = $request->validate([
                'rejection_reason' => 'required|string|max:500',
            ]);

            $media = Media::findOrFail($mediaId);

            // Delete the file from storage
            if ($media->file_path && Storage::disk('public')->exists($media->file_path)) {
                Storage::disk('public')->delete($media->file_path);
            }

            // Delete the record
            $media->delete();

            return response()->json([
                'success' => true,
                'message' => 'Media rejected and deleted',
                'rejection_reason' => $validated['rejection_reason'],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Rejection failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete media
     */
    public function delete($mediaId)
    {
        try {
            $media = Media::findOrFail($mediaId);

            // Check authorization - owner or admin
            $userId = auth('sanctum')->id();
            if ($media->uploaded_by_writer_id !== $userId && !auth('admin')->check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to delete this media',
                ], 403);
            }

            // Delete the file from storage
            if ($media->file_path && Storage::disk('public')->exists($media->file_path)) {
                Storage::disk('public')->delete($media->file_path);
            }

            // Soft delete the record
            $media->delete();

            return response()->json([
                'success' => true,
                'message' => 'Media deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Delete failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get media detail
     */
    public function show($mediaId)
    {
        try {
            $media = Media::with(['news', 'uploadedBy', 'approvedBy'])->findOrFail($mediaId);

            return response()->json([
                'success' => true,
                'data' => $media,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Media not found: ' . $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Update media details (caption, position, etc)
     */
    public function update(Request $request, $mediaId)
    {
        try {
            $validated = $request->validate([
                'position_in_article' => 'nullable|string|in:hero,body,gallery,thumbnail',
                'caption' => 'nullable|string|max:255',
                'alt_text' => 'nullable|string|max:255',
            ]);

            $media = Media::findOrFail($mediaId);

            // Check authorization
            $userId = auth('sanctum')->id();
            if ($media->uploaded_by_writer_id !== $userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to update this media',
                ], 403);
            }

            $media->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Media updated successfully',
                'data' => $media,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
