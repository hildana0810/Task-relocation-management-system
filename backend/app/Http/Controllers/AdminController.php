<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\User;
use App\Models\RelocationRequest;
use App\Models\TaxCollector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    /**
     * Admin login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create token for admin
        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'admin' => $admin,
            'message' => 'Login successful'
        ]);
    }

    /**
     * Get system statistics
     */
    public function getStats()
    {
        return response()->json([
            'totalUsers' => User::count(),
            'totalRequests' => RelocationRequest::count(),
            'pendingRequests' => RelocationRequest::where('status', 'pending')->count(),
            'taxCollectors' => TaxCollector::where('status', 'active')->count(),
        ]);
    }

    /**
     * Get all relocation requests
     */
    public function getRelocationRequests()
    {
        $requests = RelocationRequest::with('user')->get();
        return response()->json($requests);
    }

    /**
     * Get specific relocation request
     */
    public function getRelocationRequest($id)
    {
        $request = RelocationRequest::with('user')->find($id);
        if (!$request) {
            return response()->json(['message' => 'Request not found'], 404);
        }
        return response()->json($request);
    }

    /**
     * Approve relocation request
     */
    public function approveRequest(Request $request, $id)
    {
        $request->validate([
            'tax_collector_id' => 'required|exists:tax_collectors,id',
        ]);

        $relocationRequest = RelocationRequest::find($id);
        if (!$relocationRequest) {
            return response()->json(['message' => 'Request not found'], 404);
        }

        $relocationRequest->update([
            'status' => 'approved',
            'tax_collector_id' => $request->tax_collector_id,
            'approved_at' => now(),
        ]);

        return response()->json(['message' => 'Request approved successfully']);
    }

    /**
     * Reject relocation request
     */
    public function rejectRequest($id)
    {
        $relocationRequest = RelocationRequest::find($id);
        if (!$relocationRequest) {
            return response()->json(['message' => 'Request not found'], 404);
        }

        $relocationRequest->update([
            'status' => 'rejected',
            'rejected_at' => now(),
        ]);

        return response()->json(['message' => 'Request rejected successfully']);
    }

    /**
     * Get all tax collectors
     */
    public function getTaxCollectors()
    {
        $taxCollectors = TaxCollector::all();
        return response()->json($taxCollectors);
    }

    /**
     * Add new tax collector
     */
    public function addTaxCollector(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:tax_collectors,email',
            'phone' => 'required|string|max:20',
            'region' => 'required|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        $taxCollector = TaxCollector::create($request->all());
        return response()->json($taxCollector);
    }

    /**
     * Update tax collector
     */
    public function updateTaxCollector(Request $request, $id)
    {
        $taxCollector = TaxCollector::find($id);
        if (!$taxCollector) {
            return response()->json(['message' => 'Tax collector not found'], 404);
        }

        $taxCollector->update($request->all());
        return response()->json($taxCollector);
    }

    /**
     * Get all users
     */
    public function getUsers()
    {
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Admin $admin)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Admin $admin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Admin $admin)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Admin $admin)
    {
        //
    }
}
