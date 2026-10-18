<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

// Business-rule failures when booking a class. Laravel calls render() automatically.
class BookingException extends Exception
{
    public function __construct(string $message, private readonly int $status)
    {
        parent::__construct($message);
    }

    public static function slotNotFound(): self
    {
        return new self('That class does not exist.', 404);
    }

    public static function full(): self
    {
        return new self('Sorry, this class is full. Try another slot.', 409);
    }

    public static function alreadyBooked(): self
    {
        return new self('You have already booked this class.', 409);
    }

    public function render(): JsonResponse
    {
        return response()->json(['error' => $this->getMessage()], $this->status);
    }
}
