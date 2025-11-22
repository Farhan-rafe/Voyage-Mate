<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'trip_id',
        'category',
        'amount',
        'spent_on',
        'notes',
    ];

    protected $casts = [
        'amount'   => 'decimal:2',
        'spent_on' => 'date',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }
}
