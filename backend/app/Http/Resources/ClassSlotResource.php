<?php

namespace App\Http\Resources;

use App\Models\ClassSlot;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ClassSlot */
class ClassSlotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'day_of_week' => $this->day_of_week,
            'start_time' => substr($this->start_time, 0, 5),
            'capacity' => $this->capacity,
            'class_name' => $this->gymClass->name,
            'level' => $this->gymClass->level,
            'duration_min' => $this->gymClass->duration_min,
            'trainer_name' => $this->trainer->name,
            'next_date' => $this->next_date,
            'spots_left' => $this->spots_left,
        ];
    }
}
