<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\ClassSlot;
use App\Models\Enquiry;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class AdminDashboardController extends Controller
{
    public function index(): View
    {
        return view('admin.dashboard', [
            'stats' => [
                'Members' => User::query()->where('is_admin', false)->count(),
                'New enquiries' => Enquiry::query()->where('status', 'new')->count(),
                'Bookings next 7 days' => Booking::query()
                    ->whereBetween('class_date', [today()->toDateString(), today()->addDays(6)->toDateString()])->count(),
                'Classes per week' => ClassSlot::query()->count(),
            ],
            'statuses' => Enquiry::STATUSES,
        ]);
    }

    // ---------- JSON for the jQuery tables ----------

    public function enquiries(): JsonResponse
    {
        return response()->json(Enquiry::query()->latest()->limit(500)->get());
    }

    public function members(): JsonResponse
    {
        $members = User::query()->where('is_admin', false)
            ->with('plan:id,name')->withCount('bookings')
            ->latest()->limit(500)->get();

        return response()->json($members->map(fn (User $m) => [
            'id' => $m->id,
            'name' => $m->name,
            'email' => $m->email,
            'phone' => $m->phone,
            'plan' => $m->plan?->name,
            'bookings' => $m->bookings_count,
            'created_at' => $m->created_at->format('Y-m-d H:i:s'),
        ]));
    }

    public function bookings(): JsonResponse
    {
        $bookings = Booking::query()
            ->with(['user:id,name,phone', 'classSlot.gymClass:id,name', 'classSlot.trainer:id,name'])
            ->where('class_date', '>=', today()->toDateString())
            ->orderBy('class_date')->limit(500)->get()
            ->sortBy(fn (Booking $b) => $b->class_date.' '.$b->classSlot->start_time)->values();

        return response()->json($bookings->map(fn (Booking $b) => [
            'id' => $b->id,
            'class_date' => $b->class_date,
            'start_time' => substr($b->classSlot->start_time, 0, 5),
            'class_name' => $b->classSlot->gymClass->name,
            'trainer_name' => $b->classSlot->trainer->name,
            'member_name' => $b->user->name,
            'phone' => $b->user->phone,
        ]));
    }

    public function updateEnquiry(Request $request, Enquiry $enquiry): JsonResponse
    {
        $enquiry->update($request->validate(['status' => ['required', Rule::in(Enquiry::STATUSES)]]));

        return response()->json(['ok' => true]);
    }
}
