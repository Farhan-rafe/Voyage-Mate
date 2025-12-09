<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * Toggle favorite status for a destination
     */
    public function toggle(Request $request, $destinationId)
    {
        $destination = Destination::findOrFail($destinationId);
        $userId = Auth::id();

        $favorite = Favorite::where('user_id', $userId)
            ->where('destination_id', $destination->id)
            ->first();

        if ($favorite) {
            // Remove from favorites
            $favorite->delete();
            return response()->json(['is_favorited' => false, 'message' => 'Removed from favorites']);
        } else {
            // Add to favorites
            Favorite::create([
                'user_id' => $userId,
                'destination_id' => $destination->id,
            ]);
            return response()->json(['is_favorited' => true, 'message' => 'Added to favorites']);
        }
    }

    /**
     * Get all favorite destinations for the user
     */
    public function list()
    {
        $userId = Auth::id();
        $favorites = Favorite::where('user_id', $userId)
            ->with('destination.reviews')
            ->get();

        $destinations = $favorites->map(function ($favorite) {
            return $favorite->destination;
        });

        return view('favorites.index', compact('destinations'));
    }

    /**
     * Check if a destination is favorited
     */
    public function isFavorited($destinationId)
    {
        $userId = Auth::id();
        $is_favorited = Favorite::where('user_id', $userId)
            ->where('destination_id', $destinationId)
            ->exists();

        return response()->json(['is_favorited' => $is_favorited]);
    }
}
