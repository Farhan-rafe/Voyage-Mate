<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DestinationController extends Controller
{
    // Show search page and handle search queries
    public function index(Request $request)
    {
        $query = Destination::query();
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('country', 'like', "%$search%")
                  ->orWhere('type', 'like', "%$search%")
                  ->orWhere('city', 'like', "%$search%")
                  ;
            });
        }
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }
        if ($request->filled('country')) {
            $query->where('country', $request->input('country'));
        }
        $destinations = $query->orderBy('name')->paginate(10);
        // Inertia or Blade view
        return Inertia::render('destinations/index', [
            'destinations' => $destinations,
            'filters' => $request->only(['search', 'type', 'country'])
        ]);
    }

    // Show destination details
    public function show($id)
    {
        $destination = Destination::with(['reviews.user'])->findOrFail($id);
        return Inertia::render('destinations/show', [
            'destination' => $destination,
        ]);
    }
}
