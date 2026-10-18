// Admin dashboard: loads tables over AJAX with jQuery.
// User-entered data is always inserted with .text() so it can't inject HTML.
$(function () {
  // Laravel checks this token on every POST/PATCH (CSRF protection)
  $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'), Accept: 'application/json' } });

  const STATUSES = ['new', 'contacted', 'joined', 'closed'];
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const dateTime = (s) => new Date(s).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
  const date = (s) => new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const cell = (text) => $('<td>').text(text ?? '-');
  const phoneCell = (phone) => $('<td>').append($('<a>').attr('href', 'tel:' + phone).text(phone));

  function toast(message, isError) {
    $('#toast').stop(true, true).toggleClass('is-error', Boolean(isError)).text(message).fadeIn(150).delay(1800).fadeOut(300);
  }

  function showError(xhr) {
    if (xhr.status === 401 || xhr.status === 419) {
      window.location = '/admin/login'; // session expired
      return;
    }
    toast((xhr.responseJSON && xhr.responseJSON.message) || 'Something went wrong. Please try again.', true);
  }

  // ---------- enquiries ----------
  function loadEnquiries() {
    $.getJSON('/admin/data/enquiries').done(function (rows) {
      const $body = $('#enquiries-body').empty();
      rows.forEach(function (r) {
        const $select = $('<select class="form-select form-select-sm status-select">').attr('aria-label', 'Status for ' + r.name).data('id', r.id);
        STATUSES.forEach((s) => $select.append($('<option>').val(s).text(capitalize(s)).prop('selected', s === r.status)));
        $('<tr>')
          .attr('data-status', r.status)
          .append(cell(dateTime(r.created_at)), cell(r.name), phoneCell(r.phone), cell(r.goal), cell(r.plan), cell(r.preferred_time), $('<td>').append($select))
          .appendTo($body);
      });
      $('#enquiries-empty').toggle(rows.length === 0);
      filterByStatus();
    }).fail(showError);
  }

  function filterByStatus() {
    const wanted = $('#status-filter').val();
    $('#enquiries-body tr').each(function () {
      $(this).toggle(!wanted || $(this).attr('data-status') === wanted);
    });
  }

  $('#status-filter').on('change', filterByStatus);

  $('#enquiries-body').on('change', '.status-select', function () {
    const $select = $(this);
    $.ajax({ url: '/admin/enquiries/' + $select.data('id'), method: 'PATCH', data: { status: $select.val() } })
      .done(function () {
        $select.closest('tr').attr('data-status', $select.val());
        $('#stat-new').text($('#enquiries-body tr[data-status="new"]').length);
        toast('Status updated');
        filterByStatus();
      })
      .fail(showError);
  });

  // ---------- members ----------
  function loadMembers() {
    $.getJSON('/admin/data/members').done(function (rows) {
      const $body = $('#members-body').empty();
      rows.forEach(function (m) {
        $('<tr>')
          .append(cell(date(m.created_at.slice(0, 10))), cell(m.name), cell(m.email), phoneCell(m.phone), cell(m.plan || 'No plan'), cell(m.bookings).addClass('text-end'))
          .appendTo($body);
      });
      $('#members-empty').toggle(rows.length === 0);
    }).fail(showError);
  }

  $('#member-search').on('input', function () {
    const query = $(this).val().toLowerCase();
    $('#members-body tr').each(function () {
      $(this).toggle($(this).text().toLowerCase().includes(query));
    });
  });

  // ---------- bookings ----------
  function loadBookings() {
    $.getJSON('/admin/data/bookings').done(function (rows) {
      const $body = $('#bookings-body').empty();
      rows.forEach(function (b) {
        $('<tr>')
          .append(cell(date(b.class_date)), cell(b.start_time), cell(b.class_name), cell(b.trainer_name), cell(b.member_name), phoneCell(b.phone))
          .appendTo($body);
      });
      $('#bookings-empty').toggle(rows.length === 0);
    }).fail(showError);
  }

  loadEnquiries();
  loadMembers();
  loadBookings();
});
