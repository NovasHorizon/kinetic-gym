import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, DAYS, formatDate, formatTime, useApi } from '../lib/api';
import { useAuth } from '../lib/auth';
import PageHeader from '../components/PageHeader';

export default function Schedule() {
  const { member } = useAuth();
  const navigate = useNavigate();
  const { data: slots, error, reload } = useApi('/schedule');
  const [bookings, setBookings] = useState([]);
  const [day, setDay] = useState(((new Date().getDay() + 6) % 7) + 1); // 1 = Mon ... 7 = Sun, opens on today
  const [notice, setNotice] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const loadBookings = useCallback(() => {
    if (member) api('/bookings').then(setBookings).catch(() => setBookings([]));
    else setBookings([]);
  }, [member]);
  useEffect(loadBookings, [loadBookings]);

  const isBooked = (s) => bookings.some((b) => b.schedule_id === s.id && b.class_date === s.next_date);

  const book = async (slot) => {
    if (!member) return navigate('/login?next=/schedule');
    setBusyId(slot.id);
    try {
      const res = await api('/bookings', { method: 'POST', body: { schedule_id: slot.id } });
      setNotice({ ok: true, text: `Booked. ${slot.class_name}, ${formatDate(res.class_date)} at ${formatTime(slot.start_time)}.` });
      reload();
      loadBookings();
    } catch (err) {
      setNotice({ ok: false, text: err.message });
    } finally {
      setBusyId(null);
    }
    return undefined;
  };

  const daySlots = (slots || []).filter((s) => s.day_of_week === day);

  return (
    <>
      <PageHeader label="(Timetable) Book your spot" title="This week" accent={['week']}>
        {member ? 'Pick a class and book its next session in one tap.' : 'Log in to book. Spots left are live for each class\'s next session.'}
      </PageHeader>

      <section className="px-4 pb-24 md:px-8">
        <div className="sticky top-16 z-20 -mx-4 mb-6 grid grid-cols-7 gap-1 bg-ink/90 px-4 py-3 backdrop-blur md:mx-0 md:gap-2 md:px-0" role="tablist" aria-label="Day of the week">
          {DAYS.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={day === i + 1}
              onClick={() => setDay(i + 1)}
              className={`rounded-full py-2.5 text-xs font-bold uppercase tracking-[0.08em] transition md:py-3 md:text-sm ${day === i + 1 ? 'bg-volt text-white' : 'border border-bone/20 text-bone/70 hover:text-bone'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {notice && (
          <p role="status" className={`mb-6 rounded-2xl p-4 font-medium ${notice.ok ? 'bg-volt text-white' : 'border border-volt text-volt'}`}>{notice.text}</p>
        )}
        {error && <p className="text-volt">Couldn't load the timetable: {error.message}</p>}
        {!slots && !error && <p className="label">Loading…</p>}

        <ul className="border-t border-bone/15">
          {daySlots.map((s) => {
            const booked = isBooked(s);
            const full = s.spots_left === 0;
            return (
              <li key={s.id} className="grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 border-b border-bone/15 py-6 md:grid-cols-[160px_1fr_auto] md:gap-8">
                <p className="font-display text-5xl leading-none text-volt md:text-6xl">{formatTime(s.start_time).replace(' ', '')}</p>
                <div>
                  <p className="font-display text-3xl uppercase leading-none md:text-4xl">{s.class_name}</p>
                  <p className="mt-2 text-sm text-bone/60">
                    {s.trainer_name} · {s.duration_min} min · {s.level} · <span className={s.spots_left <= 3 ? 'text-volt' : ''}>{s.spots_left} spots left</span>
                  </p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  {booked ? (
                    <span className="btn btn-ghost w-full md:w-auto">Booked ✓</span>
                  ) : (
                    <button type="button" disabled={full || busyId === s.id} onClick={() => book(s)} className="btn btn-volt w-full md:w-auto">
                      {full ? 'Full' : busyId === s.id ? 'Booking…' : 'Book'}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
