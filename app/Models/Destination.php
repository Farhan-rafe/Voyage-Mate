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
        'best_time_to_visit',
        'nearest_airport',
        'local_transport',
        'must_see_attractions',
        'safety_tips',
        'history_culture',
        'entry_fees',
        'photo_gallery_1',
        'photo_gallery_2',
        'photo_gallery_3',
    ];

    /**
     * Get the reviews for the destination.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the favorites for this destination.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
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
