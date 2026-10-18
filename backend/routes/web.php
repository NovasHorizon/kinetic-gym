<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminDashboardController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/admin');

// Interactive API documentation (Swagger UI reading public/openapi.yaml)
Route::view('/docs', 'docs')->name('docs');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'create'])->name('login');
        Route::post('/login', [AdminAuthController::class, 'store'])->middleware('throttle:5,1');
    });

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::post('/logout', [AdminAuthController::class, 'destroy'])->name('logout');

        // JSON used by the jQuery tables
        Route::get('/data/enquiries', [AdminDashboardController::class, 'enquiries']);
        Route::get('/data/members', [AdminDashboardController::class, 'members']);
        Route::get('/data/bookings', [AdminDashboardController::class, 'bookings']);
        Route::patch('/enquiries/{enquiry}', [AdminDashboardController::class, 'updateEnquiry']);
    });
});
