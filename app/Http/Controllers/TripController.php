<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TripController extends Controller
{
    public function index()
    {
        $trips = Trip::where('user_id', Auth::id())
            ->latest('start_date')
            ->get();

        return Inertia::render('Trips/Index', [
            'trips' => $trips,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Trips/Create', [
            'prefill' => [
                'title'       => $request->input('title'),
                'destination' => $request->input('destination'),
                'start_date'  => $request->input('start_date'),
                'end_date'    => $request->input('end_date'),
                'description' => $request->input('description'),
                'budget'      => $request->input('budget'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'destination' => 'nullable|string|max:255',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date',
            'description' => 'nullable|string',
            'budget'      => 'nullable|numeric|min:0',
        ]);

        $data['user_id'] = Auth::id();

        // Ensure compatibility with existing SQLite schema that uses
        // `name` and `details` columns instead of `title`/`description`.
        if (! array_key_exists('name', $data) && array_key_exists('title', $data)) {
            $data['name'] = $data['title'];
        }
        if (! array_key_exists('details', $data) && array_key_exists('description', $data)) {
            $data['details'] = $data['description'];
        }

        Trip::create($data);

        return redirect()->route('trips.index')->with('success', 'Trip created.');
    }

    public function show(Trip $trip)
    {
        abort_unless($trip->user_id === Auth::id(), 403);

        $trip->load(['itineraryItems', 'expenses', 'checklistItems']);

        return Inertia::render('Trips/Show', [
            'trip'       => $trip,
            'totalSpent' => $trip->expenses->sum('amount'),
        ]);
    }

    public function edit(Trip $trip)
    {
        abort_unless($trip->user_id === Auth::id(), 403);

        return Inertia::render('Trips/Edit', [
            'trip' => $trip,   // 👈 this matches usePage<EditTripPageProps>()
        ]);

    }

    public function update(Request $request, Trip $trip)
    {
        abort_unless($trip->user_id === Auth::id(), 403);

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'destination' => 'nullable|string|max:255',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'budget'      => 'nullable|numeric|min:0',
        ]);

        // Ensure compatibility with existing SQLite schema
        if (! array_key_exists('name', $data) && array_key_exists('title', $data)) {
            $data['name'] = $data['title'];
        }
        if (! array_key_exists('details', $data) && array_key_exists('description', $data)) {
            $data['details'] = $data['description'];
        }

        $trip->update($data);

        return redirect()
            ->route('trips.show', $trip->id)
            ->with('success', 'Trip updated successfully.');
    }

 

    public function destroy(Trip $trip)
    {
        abort_unless($trip->user_id === Auth::id(), 403);

        $trip->delete();

        return redirect()->route('trips.index')->with('success', 'Trip deleted.');
    }
}
