<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // The member's upcoming classes
    public function index(Request $request)
    {
        $bookings = $request->user()->bookings()
            ->with(['classSlot.gymClass', 'classSlot.trainer'])
            ->where('class_date', '>=', today()->toDateString())
            ->get()
            ->sortBy(fn ($b) => $b->class_date.' '.$b->classSlot->start_time)
            ->values();

        return BookingResource::collection($bookings);
    }

    public function store(Request $request, BookingService $bookings): JsonResponse
    {
        $data = $request->validate(['schedule_id' => ['required', 'integer']]);
        $booking = $bookings->book($request->user(), $data['schedule_id']);

        return response()->json(['id' => $booking->id, 'class_date' => $booking->class_date], 201);
    }

    public function destroy(Request $request, int $booking): JsonResponse
    {
        // Looking up through the member's own bookings means nobody can cancel someone else's.
        $request->user()->bookings()->findOrFail($booking)->delete();

        return response()->json(['ok' => true]);
    }
}
