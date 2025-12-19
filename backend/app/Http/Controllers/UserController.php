<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Writer;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get all users (admins & writers)
     */
    public function index(Request $request)
    {
        try {
            $type = $request->query('type', 'all'); // all, admin, writer
            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 20);
            $search = $request->query('search');

            if ($type === 'admin') {
                $users = Admin::query();
            } elseif ($type === 'writer') {
                $users = Writer::query();
            } else {
                // Get both but we'll need to handle differently
                $admins = Admin::query();
                $writers = Writer::query();

                if ($search) {
                    $admins->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    $writers->where('name', 'like', "%{$search}%")
                             ->orWhere('email', 'like', "%{$search}%");
                }

                $adminList = $admins->paginate($perPage, ['*'], 'page', $page);
                $writerList = $writers->paginate($perPage, ['*'], 'page', $page);

                return response()->json([
                    'status' => true,
                    'data' => [
                        'admins' => [
                            'list' => $adminList->items(),
                            'meta' => [
                                'current_page' => $adminList->currentPage(),
                                'per_page' => $adminList->perPage(),
                                'total' => $adminList->total(),
                                'last_page' => $adminList->lastPage(),
                            ]
                        ],
                        'writers' => [
                            'list' => $writerList->items(),
                            'meta' => [
                                'current_page' => $writerList->currentPage(),
                                'per_page' => $writerList->perPage(),
                                'total' => $writerList->total(),
                                'last_page' => $writerList->lastPage(),
                            ]
                        ]
                    ]
                ]);
            }

            if ($search) {
                $users->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            }

            $users = $users->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'status' => true,
                'data' => [
                    'list' => $users->items(),
                    'meta' => [
                        'current_page' => $users->currentPage(),
                        'per_page' => $users->perPage(),
                        'total' => $users->total(),
                        'last_page' => $users->lastPage(),
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Create new admin or writer
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|min:3|max:255',
                'email' => 'required|email|unique:admins,email|unique:writers,email',
                'password' => 'required|string|min:6|confirmed',
                'role' => 'required|in:admin,writer',
            ]);

            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ];

            if ($validated['role'] === 'admin') {
                $user = Admin::create($userData);
                $userType = 'admin';
            } else {
                $user = Writer::create($userData);
                $userType = 'writer';
            }

            // Log activity
            ActivityLogService::log(
                action: 'create',
                modelType: $userType,
                modelId: $user->id,
                description: "Created new {$userType}: {$user->name} ({$user->email})",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => ucfirst($userType) . ' created successfully',
                'data' => $user
            ], 201);
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
     * Get user detail
     */
    public function show(Request $request, $id)
    {
        try {
            $type = $request->query('type', 'admin');

            if ($type === 'writer') {
                $user = Writer::findOrFail($id);
            } else {
                $user = Admin::findOrFail($id);
            }

            return response()->json([
                'status' => true,
                'data' => $user
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['status' => false, 'message' => 'User not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update user
     */
    public function update(Request $request, $id)
    {
        try {
            $type = $request->query('type', 'admin');

            if ($type === 'writer') {
                $user = Writer::findOrFail($id);
            } else {
                $user = Admin::findOrFail($id);
            }

            $validated = $request->validate([
                'name' => 'sometimes|required|string|min:3|max:255',
                'email' => [
                    'sometimes',
                    'required',
                    'email',
                    Rule::unique($type === 'writer' ? 'writers' : 'admins', 'email')->ignore($user->id),
                ],
                'password' => 'sometimes|nullable|string|min:6|confirmed',
            ]);

            $oldData = $user->toArray();

            if (isset($validated['name'])) {
                $user->name = $validated['name'];
            }

            if (isset($validated['email'])) {
                $user->email = $validated['email'];
            }

            if (isset($validated['password']) && !empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }

            $user->save();

            $changes = ActivityLogService::captureChanges($oldData, $user->toArray());
            ActivityLogService::log(
                action: 'update',
                modelType: $type,
                modelId: $user->id,
                changes: $changes,
                description: "Updated {$type}: {$user->name}",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['status' => false, 'message' => 'User not found'], 404);
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
     * Soft delete user
     */
    public function destroy(Request $request, $id)
    {
        try {
            $type = $request->query('type', 'admin');

            if ($type === 'writer') {
                $user = Writer::findOrFail($id);
            } else {
                $user = Admin::findOrFail($id);
            }

            $userName = $user->name;
            $user->delete(); // Soft delete

            ActivityLogService::log(
                action: 'delete',
                modelType: $type,
                modelId: $id,
                description: "Deleted {$type}: {$userName}",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['status' => false, 'message' => 'User not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * View soft-deleted users
     */
    public function deleted(Request $request)
    {
        try {
            $type = $request->query('type', 'admin');
            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 20);

            if ($type === 'writer') {
                $users = Writer::onlyTrashed()->paginate($perPage, ['*'], 'page', $page);
            } else {
                $users = Admin::onlyTrashed()->paginate($perPage, ['*'], 'page', $page);
            }

            return response()->json([
                'status' => true,
                'data' => [
                    'list' => $users->items(),
                    'meta' => [
                        'current_page' => $users->currentPage(),
                        'per_page' => $users->perPage(),
                        'total' => $users->total(),
                        'last_page' => $users->lastPage(),
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Restore soft-deleted user
     */
    public function restore(Request $request, $id)
    {
        try {
            $type = $request->query('type', 'admin');

            if ($type === 'writer') {
                $user = Writer::onlyTrashed()->findOrFail($id);
            } else {
                $user = Admin::onlyTrashed()->findOrFail($id);
            }

            $user->restore();

            ActivityLogService::log(
                action: 'restore',
                modelType: $type,
                modelId: $id,
                description: "Restored {$type}: {$user->name}",
                request: $request
            );

            return response()->json([
                'status' => true,
                'message' => 'User restored successfully',
                'data' => $user
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['status' => false, 'message' => 'User not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
