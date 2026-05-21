<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\QrCodeController;
use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\QrImageController;
use App\Http\Controllers\RedirectController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// QR image endpoints (public for SVG, auth for download)
Route::get('/qr/{code}/image', [QrImageController::class, 'svg'])->name('qr.image');
Route::middleware(['auth'])->get('/qr/{code}/download', [QrImageController::class, 'download'])->name('qr.download');

// Admin panel
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('qr-codes', QrCodeController::class);
    Route::get('qr-codes/{qrCode}/stats', [StatsController::class, 'show'])->name('qr-codes.stats');

    // Gestión de usuarios — solo administradores
    Route::resource('users', UserController::class)
        ->except('show')
        ->middleware('admin');
});

// Redirect de QR — bajo el prefijo /go/ para aislar el espacio de códigos
Route::get('/go/{code}', [RedirectController::class, 'redirect'])
    ->where('code', '[a-zA-Z0-9-]+')
    ->name('qr.redirect');

require __DIR__.'/settings.php';
