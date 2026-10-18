<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\MemberResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

// Members log in from the React app with Sanctum API tokens.
class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $member = User::create($request->validated());

        return response()->json($this->session($member), 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $member = User::query()->where('email', $request->validated('email'))->first();

        if (! $member || ! Hash::check($request->validated('password'), $member->password)) {
            return response()->json(['error' => 'Email or password is incorrect.'], 401);
        }

        return response()->json($this->session($member));
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['ok' => true]);
    }

    public function me(Request $request): MemberResource
    {
        return new MemberResource($request->user()->load('plan'));
    }

    private function session(User $member): array
    {
        return [
            'token' => $member->createToken('website')->plainTextToken,
            'member' => new MemberResource($member->load('plan')),
        ];
    }
}
