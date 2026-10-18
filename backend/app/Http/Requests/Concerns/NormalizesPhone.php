<?php

namespace App\Http\Requests\Concerns;

// Turns "+91 98765-43210" or "09876543210" into "9876543210" before validation.
trait NormalizesPhone
{
    protected function prepareForValidation(): void
    {
        if ($this->has('phone')) {
            $digits = preg_replace('/\D/', '', (string) $this->input('phone'));
            $this->merge(['phone' => preg_replace('/^(91|0)(?=\d{10}$)/', '', $digits)]);
        }
    }

    protected function phoneRules(): array
    {
        return ['required', 'regex:/^[6-9]\d{9}$/'];
    }

    public function messages(): array
    {
        return ['phone.regex' => 'Please enter a valid 10-digit mobile number.'];
    }
}
