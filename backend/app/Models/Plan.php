<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = ['name', 'description', 'monthly_price', 'yearly_price', 'features', 'is_featured'];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'is_featured' => 'boolean',
        ];
    }

    public function members(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
