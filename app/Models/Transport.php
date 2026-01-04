<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Trip;

class Transport extends Model
{
    use HasFactory;

    protected $fillable = [
        'trip_id',
        'type',
        'provider',
        'from_location',
        'to_location',
        'departure_time',
        'arrival_time',
        'duration_hours',
        'cost',
        'booking_reference',
        'confirmation_number',
        'seats',
        'notes',
        'status',
    ];

    protected $casts = [
        'departure_time' => 'datetime',
        'arrival_time' => 'datetime',
        'duration_hours' => 'decimal:2',
        'cost' => 'decimal:2',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }
}
