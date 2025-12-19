<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobVacancy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobVacancyController extends Controller
{
    // PUBLIC: Hanya menampilkan lowongan aktif
    public function indexPublic()
    {
        $jobs = JobVacancy::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $jobs
        ]);
    }

    // ADMIN: Menampilkan semua lowongan
    public function indexAdmin()
    {
        $jobs = JobVacancy::orderBy('created_at', 'desc')->get();
        return response()->json(['status' => true, 'data' => $jobs]);
    }

    // ADMIN: Tambah Lowongan
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'position_count' => 'required|integer|min:1',
            'registration_link' => 'required|url',
            'description' => 'required',
            'requirements' => 'required',
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $job = JobVacancy::create($request->all());
        return response()->json(['status' => true, 'message' => 'Lowongan dibuat', 'data' => $job]);
    }

    // ADMIN: Update Lowongan
    public function update(Request $request, $id)
    {
        $job = JobVacancy::findOrFail($id);
        $job->update($request->all());
        return response()->json(['status' => true, 'message' => 'Lowongan diperbarui', 'data' => $job]);
    }

    // ADMIN: Hapus Lowongan
    public function destroy($id)
    {
        JobVacancy::destroy($id);
        return response()->json(['status' => true, 'message' => 'Lowongan dihapus']);
    }
    
    public function show($id) {
        $job = JobVacancy::find($id);
        return response()->json(['status' => true, 'data' => $job]);
    }
}