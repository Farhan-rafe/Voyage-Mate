<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Trip;

class Accommodation extends Model
{
    use HasFactory;

    protected $fillable = [
        'trip_id',
        'name',
        'type',
        'location',
        'description',
        'address',
        'phone',
        'email',
        'website',
        'price_per_night',
        'check_in_date',
        'check_out_date',
        'number_of_nights',
        'rating',
        'amenities',
        'booking_reference',
        'status',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'price_per_night' => 'decimal:2',
        'amenities' => 'json',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }
}
