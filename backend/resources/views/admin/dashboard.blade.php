@extends('admin.layout')

@section('title', 'Dashboard')

@section('content')
<nav class="navbar border-bottom">
  <div class="container-xl">
    <span class="navbar-brand fw-bold">Kinetic <span class="text-accent">Admin</span></span>
    <form method="post" action="{{ route('admin.logout') }}" class="d-flex align-items-center gap-3">
      @csrf
      <span class="small text-secondary d-none d-sm-inline">Logged in as {{ auth()->user()->name }}</span>
      <button class="btn btn-outline-light btn-sm" type="submit">Log out</button>
    </form>
  </div>
</nav>

<main class="container-xl py-4">
  <div class="row g-3 mb-4">
    @foreach ($stats as $label => $value)
      <div class="col-6 col-lg-3">
        <div class="card card-body">
          <div class="small text-secondary">{{ $label }}</div>
          <div class="stat" @if ($label === 'New enquiries') id="stat-new" @endif>{{ $value }}</div>
        </div>
      </div>
    @endforeach
  </div>

  <ul class="nav nav-tabs" role="tablist">
    <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-enquiries" type="button">Enquiries</button></li>
    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-members" type="button">Members</button></li>
    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-bookings" type="button">Upcoming bookings</button></li>
  </ul>

  <div class="tab-content card card-body border-top-0 rounded-top-0">
    <section class="tab-pane fade show active" id="tab-enquiries">
      <div class="d-flex flex-wrap gap-2 justify-content-between mb-3">
        <p class="small text-secondary mb-0 align-self-center">Free-trial requests from the website. Update the status after you call them.</p>
        <select id="status-filter" class="form-select form-select-sm w-auto" aria-label="Filter by status">
          <option value="">All statuses</option>
          @foreach ($statuses as $status)
            <option value="{{ $status }}">{{ ucfirst($status) }}</option>
          @endforeach
        </select>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead><tr><th>Received</th><th>Name</th><th>Phone</th><th>Goal</th><th>Plan</th><th>Preferred time</th><th>Status</th></tr></thead>
          <tbody id="enquiries-body"></tbody>
        </table>
      </div>
      <p class="empty text-secondary small mt-3 mb-0" id="enquiries-empty">No enquiries yet.</p>
    </section>

    <section class="tab-pane fade" id="tab-members">
      <input id="member-search" type="search" class="form-control form-control-sm mb-3" placeholder="Search by name, email or phone" style="max-width: 320px">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead><tr><th>Joined</th><th>Name</th><th>Email</th><th>Phone</th><th>Plan</th><th class="text-end">Bookings</th></tr></thead>
          <tbody id="members-body"></tbody>
        </table>
      </div>
      <p class="empty text-secondary small mt-3 mb-0" id="members-empty">No members yet.</p>
    </section>

    <section class="tab-pane fade" id="tab-bookings">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead><tr><th>Date</th><th>Time</th><th>Class</th><th>Coach</th><th>Member</th><th>Phone</th></tr></thead>
          <tbody id="bookings-body"></tbody>
        </table>
      </div>
      <p class="empty text-secondary small mt-3 mb-0" id="bookings-empty">No upcoming bookings.</p>
    </section>
  </div>
</main>

<div id="toast" class="admin-toast" role="status" aria-live="polite"></div>
@endsection

@push('scripts')
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha384-1H217gwSVyLSIfaLxHbE7dRb3v4mYCKbpQvzx0cegeju1MVsGrX5xXxAvs/HgeFs" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="{{ asset('assets/admin/admin.js') }}"></script>
@endpush
