<?php

namespace Tests\Feature;

use App\Models\Enquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_sent_to_the_login_page(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->get('/admin/login')->assertOk()->assertSee('Staff login');
    }

    public function test_members_cannot_use_the_admin_panel(): void
    {
        $member = User::factory()->create(['password' => 'secret123']);

        $this->post('/admin/login', ['email' => $member->email, 'password' => 'secret123'])->assertSessionHasErrors('email');
        $this->assertGuest();
        $this->actingAs($member)->get('/admin')->assertForbidden();
    }

    public function test_admin_can_log_in_and_update_enquiries(): void
    {
        $admin = User::factory()->admin()->create(['password' => 'secret123']);
        $enquiry = Enquiry::create([
            'name' => 'Priya', 'phone' => '9876543210', 'goal' => 'Lose weight', 'plan' => 'Basic', 'preferred_time' => 'Morning (6 to 10 am)',
        ]);

        $this->post('/admin/login', ['email' => $admin->email, 'password' => 'secret123'])->assertRedirect('/admin');
        $this->get('/admin')->assertOk()->assertSee('New enquiries');
        $this->getJson('/admin/data/enquiries')->assertOk()->assertJsonPath('0.name', 'Priya');

        $this->patchJson("/admin/enquiries/{$enquiry->id}", ['status' => 'contacted'])->assertOk();
        $this->assertSame('contacted', $enquiry->fresh()->status);

        $this->patchJson("/admin/enquiries/{$enquiry->id}", ['status' => 'bogus'])->assertUnprocessable();
    }
}
