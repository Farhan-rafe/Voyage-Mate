<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $userId = Auth::id();

        $tripsQuery = Trip::where('user_id', $userId);

        // Total / active trips (for now, same thing)
        $totalTrips  = (clone $tripsQuery)->count();
        $activeTrips = $totalTrips;

        $today = now()->startOfDay();

        // Nearest upcoming trip
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

        // Budget usage = total expenses / total budget * 100
        $tripIds = (clone $tripsQuery)->pluck('id');
        $totalBudget = (clone $tripsQuery)->sum('budget');     // sum of budgets
        $totalSpent  = Expense::whereIn('trip_id', $tripIds)->sum('amount'); // sum of all expenses

        $usedBudgetPercent = 0;
        if ($totalBudget > 0) {
            $usedBudgetPercent = round(($totalSpent / $totalBudget) * 100);
        }

        // Trips starting this month (and still upcoming)
        $monthStart = now()->startOfMonth();
        $monthEnd   = now()->endOfMonth();

        $upcomingThisMonthCount = (clone $tripsQuery)
            ->whereBetween('start_date', [$monthStart, $monthEnd])
            ->whereDate('start_date', '>=', $today)
            ->count();

        return Inertia::render('dashboard', [
            'dashboardStats' => [
                'activeTrips'           => $activeTrips,
                'totalTrips'            => $totalTrips,
                'upcomingTrip'          => $upcomingTripData,
                'usedBudgetPercent'     => $usedBudgetPercent,
                'favoritesCount'        => 0, // for now
                'upcomingThisMonthCount'=> $upcomingThisMonthCount,
            ],
        ]);
    }
}
