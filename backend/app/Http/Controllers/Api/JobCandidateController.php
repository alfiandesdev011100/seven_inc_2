<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobCandidate;
use App\Models\JobVacancy;
use Illuminate\Http\Request;

class JobCandidateController extends Controller
{
    // Get Candidates by Job ID
    public function index($jobId)
    {
        $candidates = JobCandidate::where('job_vacancy_id', $jobId)
            ->orderBy('final_score', 'desc') // Urutkan berdasarkan ranking SPK
            ->get();
            
        return response()->json(['status' => true, 'data' => $candidates]);
    }

    // Upload CSV Manual
    public function import(Request $request, $jobId)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $data = array_map('str_getcsv', file($file->getRealPath()));
        $header = array_shift($data); // Skip header

        // Asumsi format CSV: Name, Email, Phone, ScoreAdmin, ScoreInterview, ScoreTest, Experience
        foreach ($data as $row) {
            if (count($row) < 7) continue;
            
            JobCandidate::create([
                'job_vacancy_id' => $jobId,
                'name' => $row[0],
                'email' => $row[1],
                'phone' => $row[2],
                'score_admin' => (float) $row[3],
                'score_interview' => (float) $row[4],
                'score_test' => (float) $row[5],
                'experience_years' => (float) $row[6],
            ]);
        }

        return response()->json(['status' => true, 'message' => 'Data kandidat berhasil diupload']);
    }

    // LOGIC SPK SAW (Simple Additive Weighting)
    public function calculateSpk($jobId)
    {
        $candidates = JobCandidate::where('job_vacancy_id', $jobId)->get();

        if ($candidates->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Tidak ada kandidat']);
        }

        // 1. Tentukan Nilai Max untuk Normalisasi (Benefit Criteria)
        $maxAdmin = $candidates->max('score_admin') ?: 1;
        $maxInterview = $candidates->max('score_interview') ?: 1;
        $maxTest = $candidates->max('score_test') ?: 1;
        $maxExp = $candidates->max('experience_years') ?: 1;

        // 2. Bobot Kriteria (Total 1.0)
        // Admin: 20%, Interview: 30%, Test: 30%, Experience: 20%
        $w1 = 0.20; 
        $w2 = 0.30; 
        $w3 = 0.30; 
        $w4 = 0.20;

        foreach ($candidates as $c) {
            // 3. Normalisasi Matriks (R)
            $r1 = $c->score_admin / $maxAdmin;
            $r2 = $c->score_interview / $maxInterview;
            $r3 = $c->score_test / $maxTest;
            $r4 = $c->experience_years / $maxExp;

            // 4. Perankingan (V)
            $c->final_score = ($r1 * $w1) + ($r2 * $w2) + ($r3 * $w3) + ($r4 * $w4);
            $c->save();
        }

        return response()->json([
            'status' => true, 
            'message' => 'Perhitungan SPK Selesai',
            'data' => JobCandidate::where('job_vacancy_id', $jobId)->orderBy('final_score', 'desc')->get()
        ]);
    }

    public function destroy($id)
    {
        JobCandidate::destroy($id);
        return response()->json(['status' => true, 'message' => 'Kandidat dihapus']);
    }
}