<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\GymController;
use Illuminate\Support\Facades\Route;

// Every route here is prefixed with /api (see bootstrap/app.php). Full docs: /api/docs

Route::get('/health', fn () => ['ok' => true]);

Route::get('/plans', [GymController::class, 'plans']);
Route::get('/trainers', [GymController::class, 'trainers']);
Route::get('/schedule', [GymController::class, 'schedule']);
Route::post('/enquiries', [GymController::class, 'storeEnquiry'])->middleware('throttle:5,1');

// Rate limits: 10 attempts per minute per IP slows down password guessing
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store'])->middleware('throttle:30,1');
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy'])->whereNumber('booking');
});
