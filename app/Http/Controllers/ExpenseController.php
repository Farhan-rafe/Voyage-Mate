<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;  

class ExpenseController extends Controller
{
    public function store(Request $request, Trip $trip)
    {
        $this->authorizeTrip($trip);

        $data = $request->validate([
            'category' => 'nullable|string|max:255',
            'amount'   => 'required|numeric|min:0',
            'spent_on' => 'nullable|date',
            'notes'    => 'nullable|string',
        ]);

        $data['trip_id'] = $trip->id;

        Expense::create($data);

        return back()->with('success', 'Expense added.');
    }

    public function update(Request $request, Expense $expense)
    {
        abort_unless(optional($expense->trip)->user_id === Auth::id(), 403);

        $data = $request->validate([
            'category' => 'nullable|string|max:255',
            'amount'   => 'required|numeric|min:0',
            'spent_on' => 'nullable|date',
            'notes'    => 'nullable|string',
        ]);

        $expense->update($data);

        return back()->with('success', 'Expense updated.');
    }

    public function destroy(Expense $expense)
    {
        $trip = $expense->trip;
        $this->authorizeTrip($trip);

        $expense->delete();

        return back()->with('success', 'Expense removed.');
    }

    protected function authorizeTrip(Trip $trip): void
    {
        abort_unless($trip->user_id === Auth::id(), 403);
    }
}
