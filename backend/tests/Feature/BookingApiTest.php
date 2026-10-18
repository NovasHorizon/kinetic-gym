<?php

namespace Tests\Feature;

use App\Models\ClassSlot;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BookingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_member_can_book_see_and_cancel_a_class(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $bookingId = $this->postJson('/api/bookings', ['schedule_id' => 1])->assertCreated()->json('id');

        $this->getJson('/api/bookings')->assertOk()->assertJsonCount(1)->assertJsonPath('0.class_name', 'Strength Foundations');
        $slot = collect($this->getJson('/api/schedule')->json())->firstWhere('id', 1);
        $this->assertSame(19, $slot['spots_left']);

        $this->deleteJson("/api/bookings/{$bookingId}")->assertOk();
        $this->assertDatabaseCount('bookings', 0);
    }

    public function test_member_cannot_double_book_or_book_a_missing_class(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/bookings', ['schedule_id' => 1])->assertCreated();
        $this->postJson('/api/bookings', ['schedule_id' => 1])
            ->assertConflict()
            ->assertJsonPath('error', 'You have already booked this class.');
        $this->postJson('/api/bookings', ['schedule_id' => 999])->assertNotFound();
    }

    public function test_full_class_rejects_more_bookings(): void
    {
        ClassSlot::query()->findOrFail(7)->update(['capacity' => 1]);

        Sanctum::actingAs(User::factory()->create());
        $this->postJson('/api/bookings', ['schedule_id' => 7])->assertCreated();

        Sanctum::actingAs(User::factory()->create());
        $this->postJson('/api/bookings', ['schedule_id' => 7])
            ->assertConflict()
            ->assertJsonPath('error', 'Sorry, this class is full. Try another slot.');
    }

    public function test_members_cannot_cancel_each_others_bookings(): void
    {
        $owner = User::factory()->create();
        $booking = $owner->bookings()->create(['class_slot_id' => 1, 'class_date' => today()->addDay()->toDateString()]);

        Sanctum::actingAs(User::factory()->create());
        $this->deleteJson("/api/bookings/{$booking->id}")->assertNotFound();
        $this->assertDatabaseHas('bookings', ['id' => $booking->id]);
    }
}
