import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate, formatTime, rupees, useApi } from '../lib/api';
import { useAuth } from '../lib/auth';
import PageHeader from '../components/PageHeader';
import { Arrow } from '../components/ui';

export default function Dashboard() {
  const { member } = useAuth();
  const { data: bookings, error, reload } = useApi('/bookings');
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState(null);

  const cancel = async (b) => {
    if (!window.confirm(`Cancel ${b.class_name} on ${formatDate(b.class_date)}?`)) return;
    setBusy(b.id);
    try {
      await api(`/bookings/${b.id}`, { method: 'DELETE' });
      setNotice('Booking cancelled.');
      reload();
    } catch (err) {
      setNotice(err.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageHeader label="(Account) Member area" title={`Hi ${member.name.split(' ')[0]}`} accent={[member.name.split(' ')[0]]} />
      <section className="grid gap-6 px-4 pb-24 md:grid-cols-[1fr_2fr] md:px-8">
        <div className="rounded-[2rem] bg-volt p-6 text-white md:p-8">
          <p className="label !text-white/70">Your plan</p>
          <p className="mt-2 font-display text-7xl uppercase leading-none">{member.plan_name || 'None yet'}</p>
          {member.plan_name
            ? <p className="mt-2 font-bold">{rupees(member.monthly_price)} / month</p>
            : <Link to="/#plans" className="mt-3 inline-block underline">Compare plans</Link>}
          <dl className="mt-8 space-y-3 border-t border-white/30 pt-6 text-sm">
            <div><dt className="opacity-70">Email</dt><dd>{member.email}</dd></div>
            <div><dt className="opacity-70">Mobile</dt><dd>{member.phone}</dd></div>
            <div><dt className="opacity-70">Member since</dt><dd>{formatDate(member.created_at.slice(0, 10))}</dd></div>
          </dl>
        </div>

        <div className="rounded-[2rem] border border-bone/15 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-4xl uppercase">Upcoming classes</h2>
            <Link to="/schedule" className="btn btn-volt">Book a class <Arrow /></Link>
          </div>
          {notice && <p className="mt-4 text-sm text-volt" role="status">{notice}</p>}
          {error && <p className="mt-4 text-volt">{error.message}</p>}
          {bookings?.length === 0 && <p className="mt-6 text-bone/60">Nothing booked yet. <Link to="/schedule" className="underline">Open the timetable</Link>.</p>}
          <ul className="mt-6">
            {bookings?.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-4 border-t border-bone/15 py-5">
                <div>
                  <p className="font-display text-2xl uppercase">{b.class_name}</p>
                  <p className="text-sm text-bone/60">{formatDate(b.class_date)} · {formatTime(b.start_time)} · {b.trainer_name}</p>
                </div>
                <button type="button" onClick={() => cancel(b)} disabled={busy === b.id} className="btn btn-ghost !px-4 !py-2 text-xs">
                  {busy === b.id ? '…' : 'Cancel'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
