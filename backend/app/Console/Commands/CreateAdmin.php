<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

// php artisan admin:create owner@ironpeak.test --name="Gym Owner"
class CreateAdmin extends Command
{
    protected $signature = 'admin:create {email} {--name=Admin} {--password= : Leave empty to be asked}';

    protected $description = 'Create a staff account that can log in to the admin panel';

    public function handle(): int
    {
        $data = [
            'email' => strtolower($this->argument('email')),
            'name' => $this->option('name'),
            'password' => $this->option('password') ?: $this->secret('Password (8+ characters)'),
        ];

        $validator = Validator::make($data, [
            'email' => ['required', 'email', 'unique:users,email'],
            'name' => ['required', 'max:100'],
            'password' => ['required', 'min:8'],
        ]);
        if ($validator->fails()) {
            $this->error($validator->errors()->first());

            return self::FAILURE;
        }

        $admin = new User($data);
        $admin->is_admin = true;
        $admin->save();

        $this->info("Admin {$admin->email} created.");

        return self::SUCCESS;
    }
}
