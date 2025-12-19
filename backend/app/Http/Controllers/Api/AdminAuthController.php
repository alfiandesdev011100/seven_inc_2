<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\Admin;

class AdminAuthController extends Controller
{
    // Fungsi Register Admin
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:admins,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:admin,admin_konten',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $admin = Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Admin berhasil terdaftar',
            'admin' => $admin,
            'token' => $token
        ], 201);
    }

    // Fungsi Login Admin
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

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Email atau password salah'
            ], 401);
        }

        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Login berhasil',
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'avatar' => $admin->avatar ? asset('storage/' . $admin->avatar) : null,
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

        $admin = $request->user();

        // Hapus avatar lama jika ada
        if ($admin->avatar && Storage::disk('public')->exists($admin->avatar)) {
            Storage::disk('public')->delete($admin->avatar);
        }

        // Simpan file baru
        $path = $request->file('avatar')->store('avatars', 'public');

        $admin->avatar = $path;
        $admin->save();

        return response()->json([
            'status' => true,
            'message' => 'Avatar berhasil diperbarui',
            'avatar_url' => asset('storage/' . $path)
        ]);
    }

    // Fungsi Update Nama Admin
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:6',
        ]);

        $admin = $request->user();
        $admin->name = $request->name;
        $admin->save();

        return response()->json([
            'status' => true,
            'message' => 'Nama berhasil diperbarui',
            'admin' => $admin
        ], 200);
    }

    // 🔹 Get Current User Profile
    public function me(Request $request)
    {
        $admin = $request->user();

        return response()->json([
            'status' => true,
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'avatar' => $admin->avatar ? asset('storage/' . $admin->avatar) : null,
                'created_at' => $admin->created_at,
            ]
        ], 200);
    }

    // 🔹 Change Password Admin
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $admin = $request->user();

        // Verify current password
        if (!Hash::check($request->current_password, $admin->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Password saat ini tidak sesuai'
            ], 401);
        }

        // Update password
        $admin->password = Hash::make($request->new_password);
        $admin->save();

        return response()->json([
            'status' => true,
            'message' => 'Password berhasil diubah'
        ], 200);
    }

    // 🔹 Fungsi Logout Admin
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Logout berhasil'
        ], 200);
    }
}
