<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->string('description');
            $table->unsignedInteger('monthly_price')->comment('Rupees per month');
            $table->unsignedInteger('yearly_price')->comment('Rupees per month when billed yearly');
            $table->json('features');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        Schema::create('trainers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('specialty', 100);
            $table->unsignedTinyInteger('experience_years');
            $table->string('photo_url');
            $table->timestamps();
        });

        Schema::create('gym_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('description');
            $table->enum('level', ['Beginner', 'Intermediate', 'All levels'])->default('All levels');
            $table->unsignedSmallInteger('duration_min');
            $table->timestamps();
        });

        // Weekly timetable: one row per recurring class slot
        Schema::create('class_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gym_class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trainer_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('day_of_week')->comment('1 = Monday ... 7 = Sunday');
            $table->time('start_time');
            $table->unsignedSmallInteger('capacity')->default(20);
            $table->timestamps();
            $table->index(['day_of_week', 'start_time']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('email');
            $table->foreignId('plan_id')->nullable()->after('phone')->constrained()->nullOnDelete();
            $table->boolean('is_admin')->default(false)->after('plan_id');
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_slot_id')->constrained()->cascadeOnDelete();
            $table->date('class_date');
            $table->timestamps();
            // A member can book the same slot only once per date
            $table->unique(['user_id', 'class_slot_id', 'class_date']);
            $table->index(['class_slot_id', 'class_date']);
        });

        // Free-trial requests from the website
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('phone', 20);
            $table->string('goal', 50);
            $table->string('plan', 50);
            $table->string('preferred_time', 50);
            $table->enum('status', ['new', 'contacted', 'joined', 'closed'])->default('new')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enquiries');
        Schema::dropIfExists('bookings');
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('plan_id');
            $table->dropColumn(['phone', 'is_admin']);
        });
        Schema::dropIfExists('class_slots');
        Schema::dropIfExists('gym_classes');
        Schema::dropIfExists('trainers');
        Schema::dropIfExists('plans');
    }
};
