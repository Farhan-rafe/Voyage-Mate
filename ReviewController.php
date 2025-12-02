<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    // Store a new review
    public function store(Request $request, $destinationId)
    {
        $destination = Destination::findOrFail($destinationId);
        $validated = $request->validate([
            'comment' => 'required|string|max:1000',
            'rating' => 'required|integer|min:1|max:5',
        ]);
        $review = Review::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'destination_id' => $destination->id,
            ],
            [
                'comment' => $validated['comment'],
                'rating' => $validated['rating'],
            ]
        );
        return redirect()->back()->with('success', 'Review submitted!');
    }
}
