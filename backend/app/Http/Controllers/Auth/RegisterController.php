<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisterController extends Controller
{
    /**
     * Display the registration form or a placeholder.
     */
    public function showRegistrationForm()
    {
        // In a typical Laravel web app this would return a view,
        // but the frontend here is React, so we just return a simple message
        // or could be removed entirely if the frontend handles the UI.
        return response()->json(['message' => 'Display registration form'], 200);
    }

    /**
     * Handle an incoming registration request.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'tinnumber' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'tinnumber' => $validated['tinnumber'] ?? null,
            'location' => $validated['location'] ?? null,
        ]);

        // Assign default user role
        // $user->assignRole('user');

        event(new Registered($user));

        // Log the user in (optional)
        // auth()->login($user);

        return response()->json(['user' => $user], 201);
    }

    /**
     * Handle API registration request with token.
     */
    public function apiRegister(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'tinnumber' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'tinnumber' => $validated['tinnumber'] ?? null,
            'location' => $validated['location'] ?? null,
        ]);

        // Assign default user role
        $user->assignRole('user');

        event(new Registered($user));

        // Create Sanctum token for the new user
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token
        ], 201);
    }
}
