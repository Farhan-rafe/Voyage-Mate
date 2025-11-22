<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\Expense;
use App\Models\ItineraryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $userId = Auth::id();

        /* ---------------------------------------------
            BASE TRIP QUERY
        --------------------------------------------- */
        $tripsQuery = Trip::where('user_id', $userId);

        $totalTrips  = (clone $tripsQuery)->count();
        $activeTrips = $totalTrips;

        $today = now()->startOfDay();


        /* ---------------------------------------------
            UPCOMING TRIP
        --------------------------------------------- */
        $upcomingTrip = (clone $tripsQuery)
            ->whereDate('start_date', '>=', $today)
            ->orderBy('start_date', 'asc')
            ->first();

        $upcomingTripData = null;

        if ($upcomingTrip) {
            $daysUntil = $today->diffInDays($upcomingTrip->start_date, false);

            if ($daysUntil < 0) {
                $daysUntil = 0;
            }

            $upcomingTripData = [
                'title'       => $upcomingTrip->title,
                'destination' => $upcomingTrip->destination,
                'start_date'  => optional($upcomingTrip->start_date)->toDateString(),
                'days_until'  => $daysUntil,
            ];
        }


        /* ---------------------------------------------
            BUDGET STATS
        --------------------------------------------- */
        $tripIds     = (clone $tripsQuery)->pluck('id');
        $totalBudget = (clone $tripsQuery)->sum('budget');
        $totalSpent  = Expense::whereIn('trip_id', $tripIds)->sum('amount');

        $usedBudgetPercent = 0;
        if ($totalBudget > 0) {
            $usedBudgetPercent = round(($totalSpent / $totalBudget) * 100);
        }


        /* ---------------------------------------------
            UPCOMING TRIPS THIS MONTH
        --------------------------------------------- */
        $monthStart = now()->startOfMonth();
        $monthEnd   = now()->endOfMonth();

        $upcomingThisMonthCount = (clone $tripsQuery)
            ->whereBetween('start_date', [$monthStart, $monthEnd])
            ->whereDate('start_date', '>=', $today)
            ->count();


        /* ---------------------------------------------
            TODAY'S ITINERARY ITEMS (WITH TIME)
        --------------------------------------------- */
        $todayDate = now()->toDateString();

        $todayItineraryItems = ItineraryItem::with(['trip' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }])
            ->whereDate('date', $todayDate)
            ->orderBy('time', 'asc')
            ->get()
            ->filter(fn($item) => $item->trip !== null)
            ->map(function ($item) {
                return [
                    'id'          => $item->id,
                    'trip_title'  => $item->trip->title,
                    'destination' => $item->trip->destination,
                    'date'        => optional($item->date)->toDateString(),
                    'time'        => $item->time,       // ⬅ TIME SENT TO DASHBOARD
                    'title'       => $item->title,
                    'location'    => $item->location,
                    'notes'       => $item->notes,
                ];
            })
            ->values();


        /* ---------------------------------------------
            RETURN TO DASHBOARD COMPONENT
        --------------------------------------------- */
        return Inertia::render('dashboard', [
            'dashboardStats' => [
                'activeTrips'            => $activeTrips,
                'totalTrips'             => $totalTrips,
                'upcomingTrip'           => $upcomingTripData,
                'usedBudgetPercent'      => $usedBudgetPercent,
                'favoritesCount'         => 0, // Future-proofing
                'upcomingThisMonthCount' => $upcomingThisMonthCount,
                'todayItineraryItems'    => $todayItineraryItems,  // ⬅ NOW INCLUDED
            ],
        ]);
    }
}
