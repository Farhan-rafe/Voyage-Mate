<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\TripShareLink;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class TripShareLinkController extends Controller
{
    public function store(Trip $trip)
    {
        abort_unless($trip->user_id === Auth::id(), 403);

        // revoke any previous active links
        TripShareLink::where('trip_id', $trip->id)
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now()]);

        // create new link
        TripShareLink::create([
            'trip_id'     => $trip->id,
            'created_by'  => Auth::id(),
            'token'       => Str::random(64),
            'expires_at'  => null, // you can add expiry later if you want
            'revoked_at'  => null,
        ]);

        return redirect()
            ->route('trips.show', $trip->id)
            ->with('success', 'Share link generated.');
    }

    public function destroy(Trip $trip)
    {
        abort_unless($trip->user_id === Auth::id(), 403);

        TripShareLink::where('trip_id', $trip->id)
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now()]);

        return redirect()
            ->route('trips.show', $trip->id)
            ->with('success', 'Share link revoked.');
    }
}
