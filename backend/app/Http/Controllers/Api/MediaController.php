<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    /**
     * Get Writer's Own Media
     */
    public function writerIndex(Request $request)
    {
        try {
            $writer = Auth::guard('sanctum')->user();

            if (!$writer || !$writer->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            // Get writer's media with status filter
            $status = $request->query('status'); // pending, approved, rejected
            $query = Media::where('writer_id', $writer->id);

            if ($status) {
                $query->where('status', $status);
            }

            $media = $query->orderBy('created_at', 'desc')->paginate(15);

            return response()->json([
                'status' => true,
                'message' => 'Media retrieved successfully',
                'data' => $media,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to retrieve media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload Media (Writer)
     */
    public function writerStore(Request $request)
    {
        try {
            // Validate
            $request->validate([
                'file' => 'required|image|max:5120', // 5MB max
            ]);

            $writer = Auth::guard('sanctum')->user();

            if (!$writer || !$writer->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $mimeType = $file->getMimeType();
            $size = $file->getSize();

            // Generate unique filename
            $filename = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '_' . time() . '.' . $file->getClientOriginalExtension();

            // Store file
            $path = Storage::disk('public')->putFileAs('media/writer-uploads', $file, $filename);

            // Create Media record
            $media = Media::create([
                'writer_id' => $writer->id,
                'filename' => $filename,
                'original_name' => $originalName,
                'mime_type' => $mimeType,
                'size' => $size,
                'path' => $path,
                'url' => Storage::disk('public')->url($path),
                'status' => 'pending', // Pending approval from admin
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Media uploaded successfully (pending admin approval)',
                'data' => $media,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to upload media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete Writer's Own Media
     */
    public function writerDestroy($id)
    {
        try {
            $writer = Auth::guard('sanctum')->user();

            $media = Media::find($id);

            if (!$media) {
                return response()->json([
                    'status' => false,
                    'message' => 'Media not found',
                ], 404);
            }

            // Only allow writer to delete their own media
            if ($media->writer_id != $writer->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'You can only delete your own media',
                ], 403);
            }

            // Delete file from storage
            Storage::disk('public')->delete($media->path);

            // Delete record
            $media->delete();

            return response()->json([
                'status' => true,
                'message' => 'Media deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get All Media (Admin Only)
     */
    public function adminIndex(Request $request)
    {
        try {
            $status = $request->query('status'); // pending, approved, rejected
            $writerId = $request->query('writer_id');

            $query = Media::query();

            if ($status) {
                $query->where('status', $status);
            }

            if ($writerId) {
                $query->where('writer_id', $writerId);
            }

            $media = $query->with('writer')->orderBy('created_at', 'desc')->paginate(20);

            return response()->json([
                'status' => true,
                'message' => 'Media retrieved successfully',
                'data' => $media,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to retrieve media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Approve/Reject Media (Admin Only)
     */
    public function approve(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:approved,rejected',
                'notes' => 'nullable|string',
            ]);

            $media = Media::find($id);

            if (!$media) {
                return response()->json([
                    'status' => false,
                    'message' => 'Media not found',
                ], 404);
            }

            $media->update([
                'status' => $request->input('status'),
                'notes' => $request->input('notes'),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Media status updated successfully',
                'data' => $media,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to update media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete Media (Admin Only)
     */
    public function adminDestroy($id)
    {
        try {
            $media = Media::find($id);

            if (!$media) {
                return response()->json([
                    'status' => false,
                    'message' => 'Media not found',
                ], 404);
            }

            // Delete file from storage
            Storage::disk('public')->delete($media->path);

            // Delete record
            $media->delete();

            return response()->json([
                'status' => true,
                'message' => 'Media deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete media: ' . $e->getMessage(),
            ], 500);
        }
    }
}
