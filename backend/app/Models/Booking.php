<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    // class_date stays a plain "Y-m-d" string: a date cast would store "Y-m-d 00:00:00",
    // which breaks exact date matching on SQLite (used by the test suite).
    protected $fillable = ['user_id', 'class_slot_id', 'class_date'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function classSlot(): BelongsTo
    {
        return $this->belongsTo(ClassSlot::class);
    }
}
