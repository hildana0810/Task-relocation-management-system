<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class LoginController extends Controller
{
    /**
     * Show login form placeholder.
     */
    public function showLoginForm()
    {
        return response()->json(['message' => 'Display login form'], 200);
    }

    /**
     * Handle a login request to the application.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials, $request->filled('remember'))) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        $request->session()->regenerate();

        return response()->json(['user' => Auth::user()], 200);
    }

    /**
     * Handle API login request with token.
     */
    public function apiLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials',
                'errors' => [
                    'email' => ['The provided credentials are incorrect.'],
                ]
            ], 422);
        }

        $user = Auth::user();
        
        // Create Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'role' => $user->role
        ], 200);
    }

    /**
     * Handle Tax Collector login request.
     */
    public function taxCollectorLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials',
                'errors' => [
                    'email' => ['The provided credentials are incorrect.'],
                ]
            ], 422);
        }

        $user = Auth::user();
        
        // Check if user is a tax collector
        if ($user->role !== 'tax_collector') {
            Auth::logout();
            return response()->json([
                'message' => 'Access denied. User is not a tax collector.',
                'errors' => [
                    'email' => ['This account is not authorized for tax collector access.'],
                ]
            ], 403);
        }
        
        // Create Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'tax_collector' => $user,
            'token' => $token
        ], 200);
    }

    /**
     * Get Tax Collector statistics.
     */
    public function getTaxCollectorStats(Request $request)
    {
        $user = $request->user();
        
        // For now, return 0 for all stats since we don't have taxpayer assignments yet
        // In the future, this will query actual taxpayer assignments
        return response()->json([
            'totalTaxpayers' => 0,
            'newAssignments' => 0,
            'pendingReviews' => 0
        ]);
    }

    /**
     * Log the user out of the application.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out'], 200);
    }

    /**
     * API logout - revoke current access token.
     */
    public function apiLogout(Request $request)
    {
        // Revoke the current access token
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}
