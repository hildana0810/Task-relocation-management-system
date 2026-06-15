<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\User;
use App\Models\RelocationRequest;
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
            "email" => "required|email",
            "password" => "required",
        ]);

        $admin = Admin::where("email", $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                "email" => ["The provided credentials are incorrect."],
            ]);
        }

        // Create token for admin
        $token = $admin->createToken("admin-token")->plainTextToken;

        return response()->json([
            "token" => $token,
            "admin" => $admin,
            "message" => "Login successful",
        ]);
    }

    /**
     * Get system statistics
     */
    public function getStats()
    {
        return response()->json([
            "totalUsers" => User::count(),
            "totalRequests" => RelocationRequest::count(),
            "pendingRequests" => RelocationRequest::where(
                "status",
                "pending",
            )->count(),
            "taxCollectors" => User::where("role", "tax_collector")->count(),
        ]);
    }

    /**
     * Get all relocation requests
     */
    public function getRelocationRequests()
    {
        $requests = RelocationRequest::with(["user", "taxCollector"])->get();
        return response()->json($requests);
    }

    /**
     * Get specific relocation request
     */
    public function getRelocationRequest($id)
    {
        $request = RelocationRequest::with("user")->find($id);
        if (!$request) {
            return response()->json(["message" => "Request not found"], 404);
        }
        return response()->json($request);
    }

    /**
     * Approve relocation request
     */
    public function approveRequest(Request $request, $id)
    {
        $request->validate([
            "tax_collector_id" => "required|exists:users,id,role,tax_collector",
        ]);

        $relocationRequest = RelocationRequest::find($id);
        if (!$relocationRequest) {
            return response()->json(["message" => "Request not found"], 404);
        }

        $relocationRequest->update([
            "status" => "completed",
            "tax_collector_id" => $request->tax_collector_id,
            "approved_at" => now(),
        ]);

        return response()->json(["message" => "Request approved successfully"]);
    }

    /**
     * Reject relocation request
     */
    public function rejectRequest($id)
    {
        $relocationRequest = RelocationRequest::find($id);
        if (!$relocationRequest) {
            return response()->json(["message" => "Request not found"], 404);
        }

        $relocationRequest->update([
            "status" => "rejected",
            "rejected_at" => now(),
        ]);

        return response()->json(["message" => "Request rejected successfully"]);
    }

    /**
     * Get all tax collectors
     */
    public function getTaxCollectors()
    {
        $taxCollectors = User::where("role", "tax_collector")
            ->select("id", "name", "location as region", "email")
            ->get();
        return response()->json($taxCollectors);
    }

    /**
     * Add new tax collector
     */
    public function addTaxCollector(Request $request)
    {
        $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|email|unique:users,email",
            "region" => "required|string|max:255",
            "password" => "required|string|min:6",
        ]);

        $taxCollector = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "location" => $request->region,
            "role" => "tax_collector",
            "password" => Hash::make($request->password),
        ]);

        return response()->json($taxCollector);
    }

    /**
     * Update tax collector
     */
    public function updateTaxCollector(Request $request, $id)
    {
        $taxCollector = User::where("role", "tax_collector")->find($id);
        if (!$taxCollector) {
            return response()->json(
                ["message" => "Tax collector not found"],
                404,
            );
        }

        $updateData = $request->all();
        if (isset($updateData["region"])) {
            $updateData["location"] = $updateData["region"];
            unset($updateData["region"]);
        }

        if (isset($updateData["password"])) {
            $updateData["password"] = Hash::make($updateData["password"]);
        }

        $taxCollector->update($updateData);
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
