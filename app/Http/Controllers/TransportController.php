<?php

namespace App\Http\Controllers;

use App\Models\Transport;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransportController extends Controller
{
    public function store(Request $request, Trip $trip)
    {
        $this->authorizeTrip($trip);

        $data = $request->validate([
            'type' => 'required|string|max:255',
            'provider' => 'nullable|string|max:255',
            'from_location' => 'required|string|max:255',
            'to_location' => 'required|string|max:255',
            'departure_time' => 'required|date_format:Y-m-d\TH:i',
            'arrival_time' => 'nullable|date_format:Y-m-d\TH:i|after:departure_time',
            'duration_hours' => 'nullable|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'booking_reference' => 'nullable|string|max:255',
            'confirmation_number' => 'nullable|string|max:255',
            'seats' => 'nullable|integer|min:1',
            'notes' => 'nullable|string',
            'status' => 'nullable|string|in:pending,confirmed,in-progress,completed',
        ]);

        $data['trip_id'] = $trip->id;

        Transport::create($data);

        return back()->with('success', 'Transport added successfully.');
    }

    public function update(Request $request, Transport $transport)
    {
        $this->authorizeTrip($transport->trip);

        $data = $request->validate([
            'type' => 'required|string|max:255',
            'provider' => 'nullable|string|max:255',
            'from_location' => 'required|string|max:255',
            'to_location' => 'required|string|max:255',
            'departure_time' => 'required|date_format:Y-m-d\TH:i',
            'arrival_time' => 'nullable|date_format:Y-m-d\TH:i|after:departure_time',
            'duration_hours' => 'nullable|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'booking_reference' => 'nullable|string|max:255',
            'confirmation_number' => 'nullable|string|max:255',
            'seats' => 'nullable|integer|min:1',
            'notes' => 'nullable|string',
            'status' => 'nullable|string|in:pending,confirmed,in-progress,completed',
        ]);

        $transport->update($data);

        return back()->with('success', 'Transport updated successfully.');
    }

    public function destroy(Transport $transport)
    {
        $trip = $transport->trip;
        $this->authorizeTrip($trip);

        $transport->delete();

        return back()->with('success', 'Transport removed.');
    }

    protected function authorizeTrip(Trip $trip): void
    {
        abort_unless($trip->user_id === Auth::id(), 403);
    }
}
