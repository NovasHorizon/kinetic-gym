<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEnquiryRequest;
use App\Http\Resources\ClassSlotResource;
use App\Models\ClassSlot;
use App\Models\Enquiry;
use App\Models\Plan;
use App\Models\Trainer;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;

// Public endpoints: no login needed.
class GymController extends Controller
{
    public function plans(): JsonResponse
    {
        return response()->json(
            Plan::query()->orderBy('monthly_price')
                ->get(['id', 'name', 'description', 'monthly_price', 'yearly_price', 'features', 'is_featured'])
        );
    }

    public function trainers(): JsonResponse
    {
        return response()->json(
            Trainer::query()->orderBy('id')->get(['id', 'name', 'specialty', 'experience_years', 'photo_url'])
        );
    }

    public function schedule(BookingService $bookings)
    {
        $slots = ClassSlot::query()->with(['gymClass', 'trainer'])
            ->orderBy('day_of_week')->orderBy('start_time')->get();
        $bookings->withAvailability($slots);

        return ClassSlotResource::collection($slots);
    }

    public function storeEnquiry(StoreEnquiryRequest $request): JsonResponse
    {
        $enquiry = Enquiry::create($request->validated());

        return response()->json([
            'message' => "Thanks {$enquiry->name}! Our team will call you within 24 hours to fix your free session.",
        ], 201);
    }
}
