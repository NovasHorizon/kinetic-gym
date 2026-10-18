<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

// "Class" is a reserved word in PHP, so the model is GymClass.
class GymClass extends Model
{
    protected $fillable = ['name', 'description', 'level', 'duration_min'];

    public function slots(): HasMany
    {
        return $this->hasMany(ClassSlot::class);
    }
}
