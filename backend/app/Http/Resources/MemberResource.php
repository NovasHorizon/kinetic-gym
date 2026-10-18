<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class MemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'plan_id' => $this->plan_id,
            'plan_name' => $this->plan?->name,
            'monthly_price' => $this->plan?->monthly_price,
        ];
    }
}
