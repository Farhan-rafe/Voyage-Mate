<?php

use App\Http\Controllers\TripController;
use App\Http\Controllers\ItineraryItemController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ChecklistItemController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SharedTripController;
use App\Http\Controllers\TripShareLinkController;
use App\Http\Controllers\SharedTripCommentController;
use App\Http\Controllers\TripJournalEntryController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\CurrencyConverterController;
use App\Http\Controllers\AccommodationController;
use App\Http\Controllers\TransportController;

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
Route::get('/api/weather/trip/{trip}', [WeatherController::class, 'getTripWeather'])->name('weather.trip');

// Comment on shared trip
Route::post('/s/{token}/comments', [SharedTripCommentController::class, 'store'])
    ->middleware('throttle:20,1')
    ->name('share.comments.store');

Route::put('/s/{token}/comments/{comment}', [SharedTripCommentController::class, 'update'])
    ->name('share.comments.update');

Route::delete('/s/{token}/comments/{comment}', [SharedTripCommentController::class, 'destroy'])
    ->name('share.comments.destroy');

// Currency
Route::post('/currency/convert', [CurrencyConverterController::class, 'convert'])
    ->middleware('auth');

// Authenticated & verified users
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('trips', TripController::class);

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

    // Accommodations
    Route::post('/trips/{trip}/accommodations', [AccommodationController::class, 'store'])
        ->name('accommodations.store');
    Route::patch('/accommodations/{accommodation}', [AccommodationController::class, 'update'])
        ->name('accommodations.update');
    Route::delete('/accommodations/{accommodation}', [AccommodationController::class, 'destroy'])
        ->name('accommodations.destroy');

    // Transport
    Route::post('/trips/{trip}/transports', [TransportController::class, 'store'])
        ->name('transports.store');
    Route::patch('/transports/{transport}', [TransportController::class, 'update'])
        ->name('transports.update');
    Route::delete('/transports/{transport}', [TransportController::class, 'destroy'])
        ->name('transports.destroy');

    // Share trip
    Route::post('/trips/{trip}/share-link', [TripShareLinkController::class, 'store'])
        ->name('trips.share-link.store');
    Route::delete('/trips/{trip}/share-link', [TripShareLinkController::class, 'destroy'])
        ->name('trips.share-link.destroy');

    // Journal
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

    // Reviews
    Route::post('/destinations/{destination}/reviews', [ReviewController::class, 'store'])
        ->name('reviews.store');

    // Favorites
    Route::post('/destinations/{destination}/favorite', [FavoriteController::class, 'toggle'])
        ->name('favorites.toggle');
    Route::get('/favorites/check/{destination}', [FavoriteController::class, 'isFavorited'])
        ->name('favorites.check');
    Route::get('/favorites', [FavoriteController::class, 'list'])
        ->name('favorites.list');
});

require __DIR__ . '/settings.php';
