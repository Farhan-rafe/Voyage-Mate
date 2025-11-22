<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ItineraryItem;
use App\Models\Expense;
use App\Models\ChecklistItem;
use App\Models\User;

class Trip extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'destination',
        'start_date',
        'end_date',
        'description',
        'budget',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'budget'     => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function itineraryItems()
    {
        return $this->hasMany(ItineraryItem::class)->orderBy('date')->orderBy('time');
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function checklistItems()
    {
        return $this->hasMany(ChecklistItem::class);
    }
}
