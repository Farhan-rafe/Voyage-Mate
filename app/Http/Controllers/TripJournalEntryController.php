<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\TripJournalEntry;
use App\Models\TripJournalImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use Inertia\Inertia;

class TripJournalEntryController extends Controller
{
    private function authorizeTrip(Trip $trip): void
    {
        abort_unless($trip->user_id === Auth::id(), 403);

    }

    public function index(Trip $trip)
    {
        $this->authorizeTrip($trip);

        $entries = $trip->journalEntries()
            ->with(['images' => fn ($q) => $q->orderBy('position')])
            ->latest()
            ->get();

        return Inertia::render('Trips/Journal', [
            'trip' => $trip,
            'entries' => $entries,
            'flash' => session('success') ? ['success' => session('success')] : null,
        ]);
    }

    public function store(Request $request, Trip $trip)
    {
        
        $this->authorizeTrip($trip);

        
        $validator = Validator::make($request->all(), [
            'entry_date' => ['nullable', 'date'],
            'title'      => ['nullable', 'string', 'max:160'],
            'body'       => ['nullable', 'string', 'max:500000'], // keep your limit
            'images'     => ['nullable', 'array'],
            'images.*'   => ['image', 'max:4096'],
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput($request->except('body')); // 🔥 don't flash huge body
        }

        $data = $validator->validated();
        $entry = TripJournalEntry::create([
            'trip_id'    => $trip->id,
            'user_id'    => Auth::id(),
            'entry_date' => $data['entry_date'] ?? null,
            'title'      => $data['title'] ?? null,
            'body'       => $data['body'],
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $img) {
                $path = $img->store('journal-images', 'public');

                $entry->images()->create([
                    'path'          => $path,
                    'position'      => $i,
                    'original_name' => $img->getClientOriginalName(),
                ]);
            }
        }

        return redirect()
            ->route('trips.journal', $trip)
            ->with('success', 'Journal entry added.');
    }


    public function update(Request $request, Trip $trip, TripJournalEntry $entry)
    {
        $this->authorizeTrip($trip);
        abort_unless($entry->trip_id === $trip->id, 404);

        $data = $request->validate([
            'entry_date' => 'nullable|date',
            'title'      => 'nullable|string|max:160',
            'body'       => 'required|string|max:500000',
            'images'     => 'nullable|array',
            'images.*'   => 'image|max:4096',
        ]);

        $entry->update([
            'entry_date' => $data['entry_date'] ?? null,
            'title'      => $data['title'] ?? null,
            'body'       => $data['body'],
        ]);

        if ($request->hasFile('images')) {
            $maxPos = (int) $entry->images()->max('position');

            foreach ($request->file('images') as $i => $img) {
                $path = $img->store('journal-images', 'public');

                $entry->images()->create([
                    'path'          => $path,
                    'position'      => $maxPos + $i + 1,
                    'original_name' => $img->getClientOriginalName(),
                ]);
            }
        }

        return back()->with('success', 'Journal entry updated.');
    }

    public function destroy(Trip $trip, TripJournalEntry $entry)
    {
        $this->authorizeTrip($trip);
        abort_unless($entry->trip_id === $trip->id, 404);

        $entry->delete();

        return back()->with('success', 'Journal entry deleted.');
    }

    // Upload multiple images at once, return URLs (for inline insertion)
    public function uploadImages(Request $request, Trip $trip, TripJournalEntry $entry)
    {
        $this->authorizeTrip($trip);
        abort_unless($entry->trip_id === $trip->id, 404);

        $data = $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|max:4096',
        ]);

        $maxPos = (int) $entry->images()->max('position');
        $created = [];

        foreach ($request->file('images') as $i => $img) {
            $path = $img->store('journal-images', 'public');
            $model = $entry->images()->create([
                'path' => $path,
                'position' => $maxPos + $i + 1,
                'original_name' => $img->getClientOriginalName(),
            ]);

            $created[] = [
                'id' => $model->id,
                'url' => asset('storage/' . $path),
                'path' => $path,
                'original_name' => $model->original_name,
                'position' => $model->position,
            ];
        }

        return response()->json([
            'images' => $created,
        ]);
    }

    public function deleteImage(Trip $trip, TripJournalEntry $entry, TripJournalImage $image)
    {
        $this->authorizeTrip($trip);
        abort_unless($entry->trip_id === $trip->id, 404);
        abort_unless($image->trip_journal_entry_id === $entry->id, 404);

        Storage::disk('public')->delete($image->path);
        $image->delete();

        return back()->with('success', 'Image deleted.');
    }

    public function reorderImages(Request $request, Trip $trip, TripJournalEntry $entry)
    {
        $this->authorizeTrip($trip);
        abort_unless($entry->trip_id === $trip->id, 404);

        $data = $request->validate([
            'ordered_ids' => 'required|array',
            'ordered_ids.*' => 'integer',
        ]);

        // Ensure all belong to this entry
        $ids = $data['ordered_ids'];
        $count = $entry->images()->whereIn('id', $ids)->count();
        abort_unless($count === count($ids), 422, 'Invalid images list.');

        foreach ($ids as $pos => $id) {
            TripJournalImage::where('id', $id)
                ->where('trip_journal_entry_id', $entry->id)
                ->update(['position' => $pos]);
        }

        return back()->with('success', 'Images reordered.');
    }

    
}
