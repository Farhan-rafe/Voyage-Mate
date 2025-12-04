<?php

use App\Http\Controllers\TripController;
use App\Http\Controllers\ItineraryItemController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ChecklistItemController;
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
    Route::post('/destinations/{destination}/reviews', [\App\Http\Controllers\ReviewController::class, 'store'])->name('reviews.store');
    
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('/trips', [TripController::class, 'index'])->name('trips.index');
    Route::get('/trips/create', [TripController::class, 'create'])->name('trips.create');
    Route::post('/trips', [TripController::class, 'store'])->name('trips.store');
    Route::get('/trips/{trip}', [TripController::class, 'show'])->name('trips.show');
    Route::delete('/trips/{trip}', [TripController::class, 'destroy'])->name('trips.destroy');
    Route::resource('trips', TripController::class);
    Route::get('/trips/{trip}/edit', [TripController::class, 'edit'])->name('trips.edit');
    Route::put('/trips/{trip}', [TripController::class, 'update'])->name('trips.update');
    
    // Itinerary
    Route::post('/trips/{trip}/itinerary-items', [ItineraryItemController::class, 'store'])
        ->name('itinerary-items.store');
    Route::patch('/itinerary-items/{item}/toggle', [ItineraryItemController::class, 'toggle'])
        ->name('itinerary-items.toggle');
    Route::patch('/itinerary-items/{itineraryItem}', [ItineraryItemController::class, 'update'])
        ->name('itinerary-items.update');
    Route::delete('/itinerary-items/{item}', [ItineraryItemController::class, 'destroy'])
        ->name('itinerary-items.destroy');

    // Expenses
    Route::post('/trips/{trip}/expenses', [ExpenseController::class, 'store'])
        ->name('expenses.store');
    Route::patch('/expenses/{expense}', [ExpenseController::class, 'update'])
        ->name('expenses.update');
    Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy'])
        ->name('expenses.destroy');

    // Checklist
    Route::post('/trips/{trip}/checklist-items', [ChecklistItemController::class, 'store'])
        ->name('checklist-items.store');
    Route::patch('/checklist-items/{checklistItem}', [ChecklistItemController::class, 'update'])
        ->name('checklist-items.update');
    Route::patch('/checklist-items/{item}/toggle', [ChecklistItemController::class, 'toggle'])
        ->name('checklist-items.toggle');
    Route::delete('/checklist-items/{item}', [ChecklistItemController::class, 'destroy'])
        ->name('checklist-items.destroy');
});

require __DIR__.'/settings.php';
