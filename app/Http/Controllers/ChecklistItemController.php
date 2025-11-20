<?php

namespace App\Http\Controllers;

use App\Models\ChecklistItem;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;   

class ChecklistItemController extends Controller
{
    public function store(Request $request, Trip $trip)
    {
        $this->authorizeTrip($trip);

        $data = $request->validate([
            'type'     => 'required|in:packing,task',
            'title'    => 'required|string|max:255',
            'due_date' => 'nullable|date',
        ]);

        $data['trip_id'] = $trip->id;

        ChecklistItem::create($data);

        return back()->with('success', 'Item added.');
    }

    public function toggle(ChecklistItem $item)
    {
        $trip = $item->trip;
        $this->authorizeTrip($trip);

        $item->update([
            'is_done' => ! $item->is_done,
        ]);

        return back();
    }

    public function update(Request $request, ChecklistItem $checklistItem)
    {
        abort_unless($checklistItem->trip->user_id === Auth::id(), 403);

        $data = $request->validate([
            'title'    => 'required|string|max:255',
            'due_date' => 'nullable|date',
        ]);

        $checklistItem->update($data);

        return back()->with('success', 'Checklist item updated.');
    }

    public function destroy(ChecklistItem $item)
    {
        $trip = $item->trip;
        $this->authorizeTrip($trip);

        $item->delete();

        return back()->with('success', 'Item removed.');
    }

    protected function authorizeTrip(Trip $trip): void
    {
        
        abort_unless($trip->user_id === Auth::id(), 403);
    }
}
