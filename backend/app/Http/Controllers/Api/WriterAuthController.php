<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\Writer;

class WriterAuthController extends Controller
{
    // Fungsi Register Writer
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:writers,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $writer = Writer::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'writer',
        ]);

        $token = $writer->createToken('writer_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Writer berhasil terdaftar',
            'writer' => $writer,
            'token' => $token
        ], 201);
    }

    // Fungsi Login Writer
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $writer = Writer::where('email', $request->email)->first();

        if (!$writer || !Hash::check($request->password, $writer->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Email atau password salah'
            ], 401);
        }

        $token = $writer->createToken('writer_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Login berhasil',
            'writer' => [
                'id' => $writer->id,
                'name' => $writer->name,
                'email' => $writer->email,
                'role' => $writer->role,
                'avatar' => $writer->avatar ? asset('storage/' . $writer->avatar) : null,
            ],
            'token' => $token
        ], 200);
    }

    // Edit Profil
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $writer = $request->user();

        // Hapus avatar lama jika ada
        if ($writer->avatar && Storage::disk('public')->exists($writer->avatar)) {
            Storage::disk('public')->delete($writer->avatar);
        }

        // Simpan file baru
        $path = $request->file('avatar')->store('avatars', 'public');

        $writer->avatar = $path;
        $writer->save();

        return response()->json([
            'status' => true,
            'message' => 'Avatar berhasil diperbarui',
            'avatar_url' => asset('storage/' . $path)
        ]);
    }

    // Fungsi Update Nama Writer
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:3',
        ]);

        $writer = $request->user();
        $writer->name = $request->name;
        $writer->save();

        return response()->json([
            'status' => true,
            'message' => 'Nama berhasil diperbarui',
            'writer' => $writer
        ], 200);
    }

    // 🔹 Get Current User Profile
    public function me(Request $request)
    {
        $writer = $request->user();

        return response()->json([
            'status' => true,
            'writer' => [
                'id' => $writer->id,
                'name' => $writer->name,
                'email' => $writer->email,
                'role' => $writer->role,
                'avatar' => $writer->avatar ? asset('storage/' . $writer->avatar) : null,
                'created_at' => $writer->created_at,
            ]
        ], 200);
    }

    // 🔹 Change Password Writer
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $writer = $request->user();

        // Verify current password
        if (!Hash::check($request->current_password, $writer->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Password saat ini tidak sesuai'
            ], 401);
        }

        // Update password
        $writer->password = Hash::make($request->new_password);
        $writer->save();

        return response()->json([
            'status' => true,
            'message' => 'Password berhasil diubah'
        ], 200);
    }

    // 🔹 Fungsi Logout Writer
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Logout berhasil'
        ], 200);
    }
}
