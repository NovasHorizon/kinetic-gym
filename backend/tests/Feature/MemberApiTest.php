<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MemberApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_endpoints_return_gym_data(): void
    {
        $this->getJson('/api/plans')->assertOk()->assertJsonCount(3)->assertJsonPath('1.name', 'Pro');
        $this->getJson('/api/trainers')->assertOk()->assertJsonCount(4);
        $this->getJson('/api/schedule')->assertOk()->assertJsonCount(24)->assertJsonStructure([
            ['id', 'day_of_week', 'start_time', 'class_name', 'trainer_name', 'next_date', 'spots_left'],
        ]);
    }

    public function test_member_can_register_but_cannot_make_themselves_admin(): void
    {
        $this->postJson('/api/auth/register', [
            'name' => 'Asha Rao',
            'email' => 'Asha@Example.com',
            'phone' => '+91 98765-43210',
            'password' => 'secret123',
            'plan_id' => 2,
            'is_admin' => true,
        ])
            ->assertCreated()
            ->assertJsonStructure(['token', 'member'])
            ->assertJsonPath('member.email', 'asha@example.com')
            ->assertJsonPath('member.phone', '9876543210')
            ->assertJsonPath('member.plan_name', 'Pro');

        $this->assertFalse(User::query()->where('email', 'asha@example.com')->first()->is_admin);
    }

    public function test_registration_rejects_bad_input(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);
        $valid = ['name' => 'Ravi', 'email' => 'ravi@example.com', 'phone' => '9123456780', 'password' => 'secret123'];

        $this->postJson('/api/auth/register', ['email' => 'taken@example.com'] + $valid)
            ->assertUnprocessable()
            ->assertJsonPath('error', 'An account with this email already exists. Please log in.');
        $this->postJson('/api/auth/register', ['phone' => '12345'] + $valid)
            ->assertUnprocessable()
            ->assertJsonPath('error', 'Please enter a valid 10-digit mobile number.');
        $this->postJson('/api/auth/register', ['password' => 'short'] + $valid)->assertUnprocessable();
    }

    public function test_login_me_and_logout(): void
    {
        User::factory()->create(['email' => 'asha@example.com', 'password' => 'secret123']);

        $this->postJson('/api/auth/login', ['email' => 'asha@example.com', 'password' => 'wrong'])
            ->assertUnauthorized()
            ->assertJsonPath('error', 'Email or password is incorrect.');

        $token = $this->postJson('/api/auth/login', ['email' => 'ASHA@example.com', 'password' => 'secret123'])
            ->assertOk()->json('token');

        $this->withToken($token)->getJson('/api/me')->assertOk()->assertJsonPath('email', 'asha@example.com');
        $this->withToken($token)->postJson('/api/auth/logout')->assertOk();

        $this->app['auth']->forgetGuards(); // the test client caches the logged-in user between requests
        $this->withToken($token)->getJson('/api/me')->assertUnauthorized();
    }

    public function test_member_routes_need_a_token(): void
    {
        $this->getJson('/api/me')->assertUnauthorized()->assertJsonPath('error', 'Please log in to continue.');
        $this->getJson('/api/bookings')->assertUnauthorized();
        $this->postJson('/api/bookings', ['schedule_id' => 1])->assertUnauthorized();
    }

    public function test_enquiry_is_saved_and_validated(): void
    {
        $enquiry = ['name' => 'Test User', 'phone' => '098765 43210', 'goal' => 'Build muscle', 'plan' => 'Pro', 'preferred_time' => 'Evening (5 to 10 pm)'];

        $this->postJson('/api/enquiries', $enquiry)->assertCreated();
        $this->assertDatabaseHas('enquiries', ['name' => 'Test User', 'phone' => '9876543210', 'status' => 'new']);

        $this->postJson('/api/enquiries', ['goal' => 'Dance'] + $enquiry)->assertUnprocessable();
    }
}
