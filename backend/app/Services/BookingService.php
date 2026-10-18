<?php

namespace App\Services;

use App\Exceptions\BookingException;
use App\Models\Booking;
use App\Models\ClassSlot;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;

class BookingService
{
    /**
     * Next date a weekly class runs. Today counts only if the class hasn't started yet.
     *
     * @param  int  $dayOfWeek  1 = Monday ... 7 = Sunday
     * @param  string  $startTime  "HH:MM" or "HH:MM:SS"
     */
    public function nextClassDate(int $dayOfWeek, string $startTime, ?CarbonImmutable $now = null): string
    {
        $now ??= CarbonImmutable::now();
        [$hour, $minute] = array_map('intval', explode(':', $startTime));

        $daysAhead = ($dayOfWeek - $now->dayOfWeekIso + 7) % 7;
        $classStart = $now->addDays($daysAhead)->setTime($hour, $minute);
        if ($classStart->lte($now)) {
            $classStart = $classStart->addWeek();
        }

        return $classStart->toDateString();
    }

    /**
     * Books the slot's next session for the member.
     * The slot row is locked, so two people can't both take the last spot.
     */
    public function book(User $member, int $slotId): Booking
    {
        try {
            return DB::transaction(function () use ($member, $slotId) {
                $slot = ClassSlot::query()->lockForUpdate()->find($slotId) ?? throw BookingException::slotNotFound();
                $date = $this->nextClassDate($slot->day_of_week, $slot->start_time);

                if ($member->bookings()->where('class_slot_id', $slot->id)->where('class_date', $date)->exists()) {
                    throw BookingException::alreadyBooked();
                }
                if ($slot->bookings()->where('class_date', $date)->count() >= $slot->capacity) {
                    throw BookingException::full();
                }

                return $member->bookings()->create(['class_slot_id' => $slot->id, 'class_date' => $date]);
            });
        } catch (UniqueConstraintViolationException) {
            throw BookingException::alreadyBooked(); // same member double-clicked "Book"
        }
    }

    /**
     * Adds next_date and spots_left to each slot for the public timetable.
     *
     * @param  iterable<ClassSlot>  $slots
     */
    public function withAvailability(iterable $slots): void
    {
        $booked = Booking::query()
            ->where('class_date', '>=', today()->toDateString())
            ->selectRaw('class_slot_id, class_date, COUNT(*) AS booked')
            ->groupBy('class_slot_id', 'class_date')
            ->get()
            ->mapWithKeys(fn ($row) => [$row->class_slot_id.'|'.$row->class_date => (int) $row->booked]);

        foreach ($slots as $slot) {
            $slot->next_date = $this->nextClassDate($slot->day_of_week, $slot->start_time);
            $slot->spots_left = max(0, $slot->capacity - ($booked[$slot->id.'|'.$slot->next_date] ?? 0));
        }
    }
}
