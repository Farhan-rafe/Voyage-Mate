<?php

use App\Http\Controllers\TripController;
use App\Http\Controllers\ItineraryItemController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ChecklistItemController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SharedTripController;
use App\Http\Controllers\TripShareLinkController;
use App\Http\Controllers\TripJournalEntryController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\CurrencyConverterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


// Root page — welcome landing
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/s/{token}', [SharedTripController::class, 'show'])->name('share.show');
// Destination search and details (public routes)
Route::get('/destinations', [DestinationController::class, 'index'])->name('destinations.index');
Route::get('/destinations/{id}', [DestinationController::class, 'show'])->name('destinations.show');

// Weather API (public)
Route::get('/api/weather/{destination}', [WeatherController::class, 'getWeather'])->name('weather.get');
Route::get('/api/weather-location', [WeatherController::class, 'getWeatherByLocation'])->name('weather.location');
use App\Http\Controllers\SharedTripCommentController;

Route::post('/s/{token}/comments', [SharedTripCommentController::class, 'store'])
    ->middleware('throttle:20,1')
    ->name('share.comments.store');
    
//currency
Route::post('/currency/convert', [CurrencyConverterController::class, 'convert'])
    ->middleware('auth');

// Reviews (only for authenticated users)
Route::middleware(['auth', 'verified'])->group(function () {
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
    //share
    Route::post('/trips/{trip}/share-link', [TripShareLinkController::class, 'store'])
        ->name('trips.share-link.store');

    Route::delete('/trips/{trip}/share-link', [TripShareLinkController::class, 'destroy'])
        ->name('trips.share-link.destroy');
    
    //journal
    Route::get('/trips/{trip}/journal', [TripJournalEntryController::class, 'index'])
        ->name('trips.journal');

    Route::post('/trips/{trip}/journal', [TripJournalEntryController::class, 'store']);
    Route::put('/trips/{trip}/journal/{entry}', [TripJournalEntryController::class, 'update']);
    Route::delete('/trips/{trip}/journal/{entry}', [TripJournalEntryController::class, 'destroy']);
    
    Route::post('/trips/{trip}/journal/{entry}/images', [TripJournalEntryController::class, 'uploadImages'])
        ->name('trips.journal.images.upload');

    Route::delete('/trips/{trip}/journal/{entry}/images/{image}', [TripJournalEntryController::class, 'deleteImage'])
        ->name('trips.journal.images.delete');

    Route::post('/trips/{trip}/journal/{entry}/images/reorder', [TripJournalEntryController::class, 'reorderImages'])
        ->name('trips.journal.images.reorder');

    
    // Reviews for destinations
    Route::post('/destinations/{destination}/reviews', [ReviewController::class, 'store'])
        ->name('reviews.store');

    // Favorites for destinations
    Route::post('/destinations/{destination}/favorite', [FavoriteController::class, 'toggle'])
        ->name('favorites.toggle');
    Route::get('/favorites/check/{destination}', [FavoriteController::class, 'isFavorited'])
        ->name('favorites.check');
    Route::get('/favorites', [FavoriteController::class, 'list'])
        ->name('favorites.list');
});

require __DIR__.'/settings.php';
