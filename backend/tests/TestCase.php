<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    // Load the sample gym data (plans, coaches, timetable) once when the test database is created.
    // It lives here, not per test class, because Laravel migrates and seeds only once per test run.
    protected bool $seed = true;
}
