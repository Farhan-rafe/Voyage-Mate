<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'country',
        'city',
        'type',
        'featured_image',
        'travel_tips',
        'latitude',
        'longitude',
    ];

    /**
     * Get the reviews for the destination.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the average rating of the destination.
     */
    public function averageRating(): float
    {
        return $this->reviews()->avg('rating') ?: 0;
    }

    /**
     * Get the count of reviews for the destination.
     */
    public function reviewsCount(): int
    {
        return $this->reviews()->count();
    }
}
