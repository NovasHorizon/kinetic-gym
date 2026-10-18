@extends('admin.layout')

@section('title', 'Staff login')
@section('body-class', 'd-flex align-items-center min-vh-100')

@section('content')
<main class="container" style="max-width: 420px">
  <h1 class="h3 fw-bold mb-1">Kinetic <span class="text-accent">Admin</span></h1>
  <p class="text-secondary mb-4">Staff login</p>
  <form method="post" action="{{ route('admin.login') }}" class="card card-body p-4">
    @csrf
    @error('email')<div class="alert alert-danger py-2">{{ $message }}</div>@enderror
    <label class="form-label" for="email">Email</label>
    <input class="form-control mb-3" id="email" name="email" type="email" required autocomplete="username" autofocus value="{{ old('email') }}">
    <label class="form-label" for="password">Password</label>
    <input class="form-control mb-4" id="password" name="password" type="password" required autocomplete="current-password">
    <button class="btn btn-accent w-100" type="submit">Log in</button>
  </form>
</main>
@endsection
