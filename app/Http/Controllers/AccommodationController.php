<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccommodationController extends Controller
{
    public function store(Request $request, Trip $trip)
    {
        $this->authorizeTrip($trip);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'website' => 'nullable|url',
            'price_per_night' => 'nullable|numeric|min:0',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'rating' => 'nullable|integer|min:1|max:5',
            'amenities' => 'nullable|json',
            'booking_reference' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:pending,confirmed,cancelled',
        ]);

        // Calculate number of nights
        $checkIn = new \DateTime($data['check_in_date']);
        $checkOut = new \DateTime($data['check_out_date']);
        $data['number_of_nights'] = $checkOut->diff($checkIn)->days;

        $data['trip_id'] = $trip->id;

        Accommodation::create($data);

        return back()->with('success', 'Accommodation added successfully.');
    }

    public function update(Request $request, Accommodation $accommodation)
    {
        $this->authorizeTrip($accommodation->trip);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'website' => 'nullable|url',
            'price_per_night' => 'nullable|numeric|min:0',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'rating' => 'nullable|integer|min:1|max:5',
            'amenities' => 'nullable|json',
            'booking_reference' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:pending,confirmed,cancelled',
        ]);

        // Calculate number of nights
        $checkIn = new \DateTime($data['check_in_date']);
        $checkOut = new \DateTime($data['check_out_date']);
        $data['number_of_nights'] = $checkOut->diff($checkIn)->days;

        $accommodation->update($data);

        return back()->with('success', 'Accommodation updated successfully.');
    }

    public function destroy(Accommodation $accommodation)
    {
        $trip = $accommodation->trip;
        $this->authorizeTrip($trip);

        $accommodation->delete();

        return back()->with('success', 'Accommodation removed.');
    }

    protected function authorizeTrip(Trip $trip): void
    {
        abort_unless($trip->user_id === Auth::id(), 403);
    }
}
