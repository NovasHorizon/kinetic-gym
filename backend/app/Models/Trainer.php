<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Trainer extends Model
{
    protected $fillable = ['name', 'specialty', 'experience_years', 'photo_url'];

    public function slots(): HasMany
    {
        return $this->hasMany(ClassSlot::class);
    }
}
