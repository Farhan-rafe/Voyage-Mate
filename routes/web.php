<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


// Destination search and details
Route::get('/destinations', [\App\Http\Controllers\DestinationController::class, 'index'])->name('destinations.index');
Route::get('/destinations/{id}', [\App\Http\Controllers\DestinationController::class, 'show'])->name('destinations.show');

// Reviews (only for authenticated users)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::post('/destinations/{id}/reviews', [\App\Http\Controllers\ReviewController::class, 'store'])->name('reviews.store');
});

require __DIR__.'/settings.php';
