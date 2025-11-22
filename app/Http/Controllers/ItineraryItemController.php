<?php

namespace App\Http\Controllers;

use App\Models\ItineraryItem;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;   

class ItineraryItemController extends Controller
{
    public function store(Request $request, Trip $trip)
    {
        $this->authorizeTrip($trip);

        $data = $request->validate([
            'date'      => 'required|date',
            'time'     => 'nullable',
            'title'    => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'notes'    => 'nullable|string',
        ]);

        $data['trip_id'] = $trip->id;

        ItineraryItem::create($data);

        return back()->with('success', 'Itinerary item added.');
    }

    public function destroy(ItineraryItem $item)
    {
        $trip = $item->trip;
        $this->authorizeTrip($trip);

        $item->delete();

        return back()->with('success', 'Itinerary item removed.');
    }

    public function toggle(ItineraryItem $item)
    {

        $item->is_done = ! $item->is_done;
        $item->save();

        return back();
    }

    public function update(Request $request, ItineraryItem $itineraryItem)
    {
        abort_unless($itineraryItem->trip->user_id === Auth::id(), 403);

        $data = $request->validate([
            'date'     => 'nullable|date',
            'time'     => 'nullable',
            'title'    => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'notes'    => 'nullable|string',
        ]);

        $itineraryItem->update($data);

        return back()->with('success', 'Itinerary item updated.');
    }
    
    protected function authorizeTrip(Trip $trip): void
    {
        abort_unless($trip->user_id === Auth::id(), 403);
    }
}
