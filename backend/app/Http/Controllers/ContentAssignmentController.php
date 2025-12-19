<?php

namespace App\Http\Controllers;

use App\Models\ContentAssignment;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ContentAssignmentController extends Controller
{
    /**
     * Admin assign task to writer
     * Instruksi dari admin: "buat artikel tentang X, letakkan di halaman Y, section Z"
     */
    public function assign(Request $request)
    {
        try {
            $validated = $request->validate([
                'news_id' => 'nullable|exists:news,id',
                'assigned_to_writer_id' => 'required|exists:writers,id',
                'required_page' => 'required|string|in:beranda,berita,tentang-kami,bisnis-kami,karir',
                'required_section' => 'required|string|in:hero,featured,body,sidebar,carousel,footer',
                'required_menu' => 'nullable|string|in:main-list,featured-slider,sidebar-admin',
                'position_order' => 'nullable|integer|min:1',
                'instruction' => 'required|string|max:1000',
                'context_reference' => 'nullable|string|max:500',
                'due_date' => 'nullable|date|after:now',
            ]);

            $assignment = ContentAssignment::create([
                'news_id' => $validated['news_id'] ?? null,
                'assigned_by_admin_id' => auth('sanctum')->id(),
                'assigned_to_writer_id' => $validated['assigned_to_writer_id'],
                'required_page' => $validated['required_page'],
                'required_section' => $validated['required_section'],
                'required_menu' => $validated['required_menu'] ?? 'main-list',
                'position_order' => $validated['position_order'] ?? 0,
                'instruction' => $validated['instruction'],
                'context_reference' => $validated['context_reference'] ?? null,
                'status' => 'pending',
                'due_date' => $validated['due_date'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Task assigned successfully',
                'data' => $assignment->load(['assignedBy', 'assignedTo', 'news']),
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
                'message' => 'Assignment failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Writer acknowledge/accept the task
     */
    public function acknowledge(Request $request, $assignmentId)
    {
        try {
            $assignment = ContentAssignment::findOrFail($assignmentId);

            // Check authorization - must be assigned writer
            if ($assignment->assigned_to_writer_id !== auth('sanctum')->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to acknowledge this assignment',
                ], 403);
            }

            $assignment->update([
                'status' => 'acknowledged',
                'acknowledged_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Task acknowledged, you can now start working',
                'data' => $assignment,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Acknowledgement failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Writer update assignment status to in_progress
     */
    public function startWorking(Request $request, $assignmentId)
    {
        try {
            $assignment = ContentAssignment::findOrFail($assignmentId);

            // Check authorization
            if ($assignment->assigned_to_writer_id !== auth('sanctum')->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 403);
            }

            $assignment->update(['status' => 'in_progress']);

            return response()->json([
                'success' => true,
                'message' => 'Status updated to in progress',
                'data' => $assignment,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Writer submit completed task
     */
    public function submit(Request $request, $assignmentId)
    {
        try {
            $validated = $request->validate([
                'news_id' => 'required|exists:news,id',
            ]);

            $assignment = ContentAssignment::findOrFail($assignmentId);

            // Check authorization
            if ($assignment->assigned_to_writer_id !== auth('sanctum')->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 403);
            }

            // Update assignment and link news
            $assignment->update([
                'news_id' => $validated['news_id'],
                'status' => 'submitted',
            ]);

            // Update news with positioning info from assignment
            $news = News::findOrFail($validated['news_id']);
            $news->update([
                'target_page' => $assignment->required_page,
                'target_section' => $assignment->required_section,
                'target_menu' => $assignment->required_menu,
                'position_order' => $assignment->position_order,
                'position_notes' => 'Per assignment: ' . $assignment->context_reference,
                'status' => 'pending_review', // Waiting for admin review
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Task submitted for admin review',
                'data' => $assignment->load('news'),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Submit failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Writer get their assignments
     */
    public function getMyAssignments(Request $request)
    {
        try {
            $writerId = auth('sanctum')->id();
            
            $query = ContentAssignment::where('assigned_to_writer_id', $writerId)
                ->with(['assignedBy', 'news'])
                ->orderBy('status')
                ->orderByDesc('created_at');

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter overdue if requested
            if ($request->get('overdue') === 'true') {
                $query->overdue();
            }

            $assignments = $query->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $assignments,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch assignments: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin get all assignments
     */
    public function getAllAssignments(Request $request)
    {
        try {
            $query = ContentAssignment::with(['assignedBy', 'assignedTo', 'news'])
                ->orderByDesc('created_at');

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by writer if provided
            if ($request->has('writer_id')) {
                $query->where('assigned_to_writer_id', $request->writer_id);
            }

            // Filter by page if provided
            if ($request->has('page_filter')) {
                $query->where('required_page', $request->page_filter);
            }

            // Get active assignments (not completed)
            if ($request->get('active') === 'true') {
                $query->active();
            }

            $assignments = $query->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $assignments,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch assignments: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin mark assignment as completed
     */
    public function markCompleted(Request $request, $assignmentId)
    {
        try {
            $assignment = ContentAssignment::findOrFail($assignmentId);

            $assignment->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Assignment marked as completed',
                'data' => $assignment,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get assignment detail
     */
    public function show($assignmentId)
    {
        try {
            $assignment = ContentAssignment::with(['assignedBy', 'assignedTo', 'news'])->findOrFail($assignmentId);

            return response()->json([
                'success' => true,
                'data' => $assignment,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Assignment not found: ' . $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Admin update assignment details
     */
    public function update(Request $request, $assignmentId)
    {
        try {
            $validated = $request->validate([
                'required_page' => 'nullable|string|in:beranda,berita,tentang-kami,bisnis-kami,karir',
                'required_section' => 'nullable|string|in:hero,featured,body,sidebar,carousel,footer',
                'position_order' => 'nullable|integer|min:1',
                'instruction' => 'nullable|string|max:1000',
                'due_date' => 'nullable|date|after:now',
            ]);

            $assignment = ContentAssignment::findOrFail($assignmentId);

            $assignment->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Assignment updated successfully',
                'data' => $assignment,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin cancel assignment
     */
    public function cancel(Request $request, $assignmentId)
    {
        try {
            $validated = $request->validate([
                'cancellation_reason' => 'required|string|max:500',
            ]);

            $assignment = ContentAssignment::findOrFail($assignmentId);

            // Only cancel if not yet completed
            if ($assignment->status === 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot cancel completed assignment',
                ], 422);
            }

            $assignment->update(['status' => 'completed']); // Mark as completed to hide it
            $assignment->delete(); // Soft delete

            return response()->json([
                'success' => true,
                'message' => 'Assignment cancelled',
                'reason' => $validated['cancellation_reason'],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cancellation failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
