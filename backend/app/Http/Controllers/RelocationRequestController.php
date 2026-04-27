<?php

namespace App\Http\Controllers;

use App\Models\RelocationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RelocationRequestController extends Controller
{
    /**
     * Store a newly created relocation request in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'business_name' => 'required|string|max:255',
            'tin_number' => 'required|string|max:255',
            'current_address' => 'required|string',
            'current_postcode' => 'required|string|max:20',
            'new_address' => 'required|string',
            'new_postcode' => 'required|string|max:20',
            'relocation_date' => 'required|date|after:today',
            'reason_for_relocation' => 'required|string',
            'contact_person' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'contact_email' => 'required|email|max:255',
            'additional_info' => 'nullable|string',
        ]);

        $relocationRequest = RelocationRequest::create([
            'user_id' => Auth::id(),
            'business_name' => $request->business_name,
            'tin_number' => $request->tin_number,
            'current_address' => $request->current_address,
            'current_postcode' => $request->current_postcode,
            'new_address' => $request->new_address,
            'new_postcode' => $request->new_postcode,
            'relocation_date' => $request->relocation_date,
            'reason_for_relocation' => $request->reason_for_relocation,
            'contact_person' => $request->contact_person,
            'contact_phone' => $request->contact_phone,
            'contact_email' => $request->contact_email,
            'additional_info' => $request->additional_info,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Relocation request submitted successfully',
            'relocation_request' => $relocationRequest
        ], 201);
    }

    /**
     * Get the authenticated user's relocation requests
     */
    public function index()
    {
        $requests = RelocationRequest::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($requests);
    }

    /**
     * Get a specific relocation request
     */
    public function show($id)
    {
        $request = RelocationRequest::where('user_id', Auth::id())
            ->find($id);
            
        if (!$request) {
            return response()->json(['message' => 'Request not found'], 404);
        }
        
        return response()->json($request);
    }
}
