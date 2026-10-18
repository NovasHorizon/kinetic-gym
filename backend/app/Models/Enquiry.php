<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    public const GOALS = ['Lose weight', 'Build muscle', 'Get fit and active', 'Train for a sport'];

    public const PLANS = ['Not sure yet', 'Basic', 'Pro', 'Elite'];

    public const TIMES = ['Morning (6 to 10 am)', 'Afternoon (12 to 4 pm)', 'Evening (5 to 10 pm)'];

    public const STATUSES = ['new', 'contacted', 'joined', 'closed'];

    protected $fillable = ['name', 'phone', 'goal', 'plan', 'preferred_time', 'status'];
}
