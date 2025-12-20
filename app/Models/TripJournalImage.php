<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripJournalImage extends Model
{
    use HasFactory;

    protected $fillable = [
    'trip_journal_entry_id',
    'path',
    'position',
    'original_name',
    ];

    public function entry()
    {
        return $this->belongsTo(TripJournalEntry::class, 'trip_journal_entry_id');
    }
}
