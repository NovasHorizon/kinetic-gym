<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\NormalizesPhone;
use App\Models\Enquiry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEnquiryRequest extends FormRequest
{
    use NormalizesPhone;

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'phone' => $this->phoneRules(),
            'goal' => ['required', Rule::in(Enquiry::GOALS)],
            'plan' => ['required', Rule::in(Enquiry::PLANS)],
            'preferred_time' => ['required', Rule::in(Enquiry::TIMES)],
        ];
    }
}
