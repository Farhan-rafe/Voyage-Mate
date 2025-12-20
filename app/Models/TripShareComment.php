<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripShareComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'trip_share_link_id',
        'user_id',
        'name',
        'email',
        'body',
    ];

    public function shareLink()
    {
        return $this->belongsTo(TripShareLink::class, 'trip_share_link_id');
    }
}
