<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\NormalizesPhone;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    use NormalizesPhone {
        prepareForValidation as normalizePhone;
    }

    protected function prepareForValidation(): void
    {
        $this->normalizePhone();
        $this->merge([
            'email' => strtolower(trim((string) $this->input('email'))),
            'plan_id' => $this->input('plan_id') ?: null,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'phone' => $this->phoneRules(),
            'password' => ['required', 'string', Password::min(8)],
            'plan_id' => ['nullable', 'integer', 'exists:plans,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'Please enter a valid 10-digit mobile number.',
            'email.unique' => 'An account with this email already exists. Please log in.',
            'plan_id.exists' => 'Please choose a valid plan.',
        ];
    }
}
