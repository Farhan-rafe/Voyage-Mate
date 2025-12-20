<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripJournalEntry extends Model
{
    protected $fillable = [
        'trip_id',
        'user_id',
        'entry_date',
        'title',
        'body',
    ];

    protected $casts = [
        'entry_date' => 'date',
    ];

    public function images()
    {
        return $this->hasMany(TripJournalImage::class, 'trip_journal_entry_id')
                ->orderBy('position');    }
}
