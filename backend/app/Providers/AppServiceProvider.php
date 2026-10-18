<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // API responses are plain JSON arrays/objects (no {"data": ...} wrapper).
        JsonResource::withoutWrapping();

        // In development, crash on N+1 queries (lazy loading) instead of silently running hundreds of queries.
        Model::preventLazyLoading(! $this->app->isProduction());
    }
}
