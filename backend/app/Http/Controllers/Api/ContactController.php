<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * GET /api/public/kontak - Public endpoint (READ ONLY)
     */
    public function showPublic()
    {
        $contact = Contact::first();

        if (!$contact) {
            // Default empty contact
            return response()->json([
                'status' => true,
                'data' => [
                    'id' => null,
                    'address' => '',
                    'phone' => '',
                    'email' => '',
                    'whatsapp' => '',
                    'description' => '',
                ]
            ], 200);
        }

        return response()->json([
            'status' => true,
            'data' => $contact->toArray()
        ], 200);
    }

    /**
     * GET /api/admin/kontak - Admin endpoint (authenticated)
     */
    public function showAdmin()
    {
        $contact = Contact::first();

        if (!$contact) {
            // Create default contact if not exists
            $contact = Contact::create([
                'address' => 'Jl. Gejayan, Yogyakarta',
                'phone' => '0896-1234-5678',
                'email' => 'info@seveninc.com',
                'whatsapp' => '6289612345678',
                'description' => '',
            ]);
        }

        return response()->json([
            'status' => true,
            'data' => $contact->toArray()
        ], 200);
    }

    /**
     * PUT /api/admin/kontak - Admin update contact
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'whatsapp' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $contact = Contact::first();
        if (!$contact) {
            $contact = new Contact();
        }

        $contact->address = $request->address ?? $contact->address;
        $contact->phone = $request->phone ?? $contact->phone;
        $contact->email = $request->email ?? $contact->email;
        $contact->whatsapp = $request->whatsapp ?? $contact->whatsapp;
        $contact->description = $request->description ?? $contact->description;
        $contact->save();

        return response()->json([
            'status' => true,
            'message' => 'Kontak berhasil diperbarui',
            'data' => $contact->toArray()
        ], 200);
    }
}
