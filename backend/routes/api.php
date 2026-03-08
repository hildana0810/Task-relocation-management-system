<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication API routes
Route::post('/login', [LoginController::class, 'apiLogin']);
Route::post('/register', [RegisterController::class, 'apiRegister']);
Route::post('/logout', [LoginController::class, 'apiLogout'])->middleware('auth:sanctum');

// Tax Collector authentication
Route::post('/tax-collector/login', [LoginController::class, 'taxCollectorLogin']);

// Tax Collector stats
Route::get('/tax-collector/stats', [LoginController::class, 'getTaxCollectorStats'])->middleware('auth:sanctum');

// Admin routes
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/stats', [AdminController::class, 'getStats']);
        Route::get('/relocation-requests', [AdminController::class, 'getRelocationRequests']);
        Route::get('/relocation-requests/{id}', [AdminController::class, 'getRelocationRequest']);
        Route::post('/relocation-requests/{id}/approve', [AdminController::class, 'approveRequest']);
        Route::post('/relocation-requests/{id}/reject', [AdminController::class, 'rejectRequest']);
        Route::get('/tax-collectors', [AdminController::class, 'getTaxCollectors']);
        Route::post('/tax-collectors', [AdminController::class, 'addTaxCollector']);
        Route::put('/tax-collectors/{id}', [AdminController::class, 'updateTaxCollector']);
        Route::get('/users', [AdminController::class, 'getUsers']);
    });
});
