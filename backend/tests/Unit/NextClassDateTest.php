<?php

namespace Tests\Unit;

use App\Services\BookingService;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class NextClassDateTest extends TestCase
{
    public static function cases(): array
    {
        // "Now" is Wednesday 14 Oct 2026, 09:00
        return [
            'later today' => [3, '18:00', '2026-10-14'],
            'already started today' => [3, '06:00', '2026-10-21'],
            'starting right now' => [3, '09:00', '2026-10-21'],
            'tomorrow' => [4, '06:00', '2026-10-15'],
            'next Monday' => [1, '06:00', '2026-10-19'],
            'this Sunday' => [7, '08:00', '2026-10-18'],
            'time with seconds' => [3, '18:00:00', '2026-10-14'],
        ];
    }

    #[DataProvider('cases')]
    public function test_next_class_date(int $dayOfWeek, string $startTime, string $expected): void
    {
        $wednesday9am = CarbonImmutable::parse('2026-10-14 09:00');

        $this->assertSame($expected, (new BookingService)->nextClassDate($dayOfWeek, $startTime, $wednesday9am));
    }
}
