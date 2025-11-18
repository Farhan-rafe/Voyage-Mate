<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItineraryItem extends Model
{
    /** @use HasFactory<\Database\Factories\ItineraryItemFactory> */
    use HasFactory;

    protected $fillable = [
        'trip_id',
        'date',
        'title',
        'location',
        'notes',
        'sort_order',
    ];

    public function trip(): BelongsTo
    {
        return $this->belongsTo(Trip::class);
    }
}
