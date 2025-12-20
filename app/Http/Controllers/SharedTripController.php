<?php

namespace App\Http\Controllers;

use App\Models\TripShareLink;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SharedTripController extends Controller
{
    public function show(string $token)
    {
        $share = TripShareLink::active()
            ->where('token', $token)
            ->firstOrFail();

        $trip = $share->trip()
            ->with(['itineraryItems', 'expenses', 'checklistItems'])
            ->firstOrFail();

        $comments = $share->comments()
            ->latest()
            ->get();

        $user = Auth::user();

        return Inertia::render('Trips/SharedShow', [
            'trip'       => $trip,
            'totalSpent' => $trip->expenses->sum('amount'),

            'share' => [
                'token' => $share->token,
            ],

            'viewer' => [
                'name'  => $user?->name ?? '',
                'email' => $user?->email ?? '',
            ],

            'comments' => $comments,
            'flash' => session('success') ? ['success' => session('success')] : null,
        ]);
    }
}
