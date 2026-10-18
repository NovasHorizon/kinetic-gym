<?php

namespace Database\Seeders;

use App\Models\ClassSlot;
use App\Models\GymClass;
use App\Models\Plan;
use App\Models\Trainer;
use Illuminate\Database\Seeder;

// Sample data for the Kinetic demo gym: plans, coaches, classes and the weekly timetable.
class GymSeeder extends Seeder
{
    public function run(): void
    {
        if (Plan::query()->exists()) {
            return; // already seeded (safe to run on every deploy)
        }

        foreach ([
            ['Basic', 'Everything you need to get started.', 1499, 1199, false,
                ['Full gym floor access', 'Open 5 am to 11 pm', 'Locker and shower', 'Day-one fitness assessment', 'Starter workout plan']],
            ['Pro', 'For people serious about results.', 2999, 2399, true,
                ['Everything in Basic', '24/7 access', 'Unlimited group classes', 'Monthly diet plan', 'Steam and recovery zone', '2 personal training sessions']],
            ['Elite', 'Full coaching, nothing left to chance.', 5999, 4799, false,
                ['Everything in Pro', '12 personal training sessions', 'Monthly body composition scan', 'Priority class booking', '2 guest passes a month']],
        ] as [$name, $description, $monthly, $yearly, $featured, $features]) {
            Plan::create([
                'name' => $name, 'description' => $description, 'monthly_price' => $monthly,
                'yearly_price' => $yearly, 'is_featured' => $featured, 'features' => $features,
            ]);
        }

        $photo = fn (string $id) => "https://images.unsplash.com/photo-{$id}?auto=format&fit=crop&w=600&h=800&q=70";
        $trainers = collect([
            ['Rohan Deshmukh', 'Head Coach, Strength', 12, '1567013127542-490d757e51fc'],
            ['Ananya Kulkarni', 'Strength & Conditioning', 8, '1550345332-09e3ac987658'],
            ['Arjun Patil', 'HIIT & Kickboxing', 7, '1611672585731-fa10603fb9e0'],
            ['Sneha Joshi', 'Yoga & Mobility', 9, '1550259979-ed79b48d2a30'],
        ])->mapWithKeys(fn ($t) => [$t[0] => Trainer::create([
            'name' => $t[0], 'specialty' => $t[1], 'experience_years' => $t[2], 'photo_url' => $photo($t[3]),
        ])]);

        $classes = collect([
            ['Strength Foundations', 'Learn the big lifts with perfect form.', 'Beginner', 60],
            ['HIIT Burn', 'Short, intense intervals for maximum calorie burn.', 'Intermediate', 45],
            ['Kickboxing', 'Pad work, footwork and fight conditioning.', 'All levels', 60],
            ['Power Yoga', 'Strength-focused flow to build control and balance.', 'All levels', 60],
            ['Mobility Flow', 'Open up tight hips, shoulders and spine.', 'All levels', 45],
            ['Olympic Lifting', 'Snatch and clean & jerk technique.', 'Intermediate', 75],
            ['Zumba', 'Dance cardio with high energy and great music.', 'All levels', 45],
            ['Bootcamp', 'Team circuits with sleds, ropes and kettlebells.', 'Intermediate', 45],
            ['Powerlifting Club', 'Squat, bench and deadlift programming.', 'Intermediate', 75],
            ['Saturday Smash', 'Whole-gym team workout to end the week.', 'All levels', 60],
            ['Yoga & Breathwork', 'Long, slow flow with guided breathing.', 'All levels', 75],
            ['Open Sparring', 'Controlled sparring for kickboxing members.', 'Intermediate', 60],
            ['Recovery Yoga', 'Gentle stretching to recover from the week.', 'Beginner', 60],
        ])->mapWithKeys(fn ($c) => [$c[0] => GymClass::create([
            'name' => $c[0], 'description' => $c[1], 'level' => $c[2], 'duration_min' => $c[3],
        ])]);

        // [day (1 = Mon), start, class, coach, capacity]
        $timetable = [
            [1, '06:00', 'Strength Foundations', 'Rohan Deshmukh', 20], [1, '07:30', 'HIIT Burn', 'Arjun Patil', 20],
            [1, '18:00', 'Kickboxing', 'Arjun Patil', 15], [1, '19:30', 'Power Yoga', 'Sneha Joshi', 20],
            [2, '06:00', 'HIIT Burn', 'Arjun Patil', 20], [2, '07:00', 'Mobility Flow', 'Sneha Joshi', 20],
            [2, '18:30', 'Olympic Lifting', 'Ananya Kulkarni', 8], [2, '20:00', 'Zumba', 'Sneha Joshi', 25],
            [3, '06:00', 'Strength Foundations', 'Rohan Deshmukh', 20], [3, '07:30', 'Bootcamp', 'Ananya Kulkarni', 16],
            [3, '18:00', 'Kickboxing', 'Arjun Patil', 15], [3, '19:30', 'Power Yoga', 'Sneha Joshi', 20],
            [4, '06:00', 'HIIT Burn', 'Arjun Patil', 20], [4, '07:00', 'Mobility Flow', 'Sneha Joshi', 20],
            [4, '18:30', 'Powerlifting Club', 'Rohan Deshmukh', 10], [4, '20:00', 'Zumba', 'Sneha Joshi', 25],
            [5, '06:00', 'Strength Foundations', 'Rohan Deshmukh', 20], [5, '07:30', 'HIIT Burn', 'Arjun Patil', 20],
            [5, '18:00', 'Kickboxing', 'Arjun Patil', 15], [5, '19:30', 'Bootcamp', 'Ananya Kulkarni', 16],
            [6, '07:00', 'Saturday Smash', 'Rohan Deshmukh', 30], [6, '09:00', 'Yoga & Breathwork', 'Sneha Joshi', 20],
            [6, '17:00', 'Open Sparring', 'Arjun Patil', 12],
            [7, '08:00', 'Recovery Yoga', 'Sneha Joshi', 20],
        ];
        foreach ($timetable as [$day, $start, $class, $coach, $capacity]) {
            ClassSlot::create([
                'gym_class_id' => $classes[$class]->id, 'trainer_id' => $trainers[$coach]->id,
                'day_of_week' => $day, 'start_time' => $start, 'capacity' => $capacity,
            ]);
        }
    }
}
