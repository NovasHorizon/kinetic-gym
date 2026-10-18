<?php

namespace App\Http\Resources;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Booking */
class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $slot = $this->classSlot;

        return [
            'id' => $this->id,
            'schedule_id' => $this->class_slot_id,
            'class_date' => $this->class_date,
            'start_time' => substr($slot->start_time, 0, 5),
            'class_name' => $slot->gymClass->name,
            'duration_min' => $slot->gymClass->duration_min,
            'trainer_name' => $slot->trainer->name,
        ];
    }
}
