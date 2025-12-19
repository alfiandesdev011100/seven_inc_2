<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InternshipProgram;
use Illuminate\Http\Request;

class InternshipProgramController extends Controller
{
    // GET: List semua program magang (ADMIN)
    public function adminIndex(Request $request)
    {
        // Authorize
        if (!in_array($request->user()->role, ['admin', 'admin_konten', 'super_admin'])) {
            abort(403, 'Anda tidak memiliki akses.');
        }

        $programs = InternshipProgram::latest()->paginate(10);

        return response()->json([
            'status' => true,
            'data' => $programs->items(),
            'pagination' => [
                'total' => $programs->total(),
                'per_page' => $programs->perPage(),
                'current_page' => $programs->currentPage(),
                'last_page' => $programs->lastPage(),
            ]
        ]);
    }

    // POST: Create program magang
    public function store(Request $request)
    {
        // Authorize
        if (!in_array($request->user()->role, ['admin', 'admin_konten', 'super_admin'])) {
            abort(403, 'Anda tidak memiliki akses.');
        }

        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'duration'     => 'required|string|max:100',
            'allowance'    => 'nullable|string|max:100',
            'requirements' => 'nullable|string',
            'is_active'    => 'boolean',
        ]);

        $program = InternshipProgram::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Program magang berhasil ditambahkan',
            'data' => $program
        ], 201);
    }

    // GET: Detail program
    public function show($id)
    {
        $program = InternshipProgram::findOrFail($id);

        return response()->json([
            'status' => true,
            'data' => $program
        ]);
    }

    // PUT: Update program
    public function update(Request $request, $id)
    {
        // Authorize
        if (!in_array($request->user()->role, ['admin', 'admin_konten', 'super_admin'])) {
            abort(403, 'Anda tidak memiliki akses.');
        }

        $program = InternshipProgram::findOrFail($id);

        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'duration'     => 'required|string|max:100',
            'allowance'    => 'nullable|string|max:100',
            'requirements' => 'nullable|string',
            'is_active'    => 'boolean',
        ]);

        $program->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Program magang berhasil diperbarui',
            'data' => $program
        ]);
    }

    // DELETE: Hapus program
    public function destroy(Request $request, $id)
    {
        // Authorize
        if (!in_array($request->user()->role, ['admin', 'admin_konten', 'super_admin'])) {
            abort(403, 'Anda tidak memiliki akses.');
        }

        $program = InternshipProgram::findOrFail($id);
        $program->delete();

        return response()->json([
            'status' => true,
            'message' => 'Program magang berhasil dihapus'
        ]);
    }
}
