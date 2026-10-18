import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { api, rupees, useApi } from '../lib/api';
import { useAuth } from '../lib/auth';
import PageHeader from '../components/PageHeader';
import { Arrow } from '../components/ui';

function useForm(initial) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ sending: false, error: null });
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  return { form, update, status, setStatus };
}

export function Join() {
  const { member, saveSession } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data: plans } = useApi('/plans');
  const { form, update, status, setStatus } = useForm({ name: '', email: '', phone: '', password: '', plan_id: params.get('plan') || '' });

  if (member) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, error: null });
    try {
      saveSession(await api('/auth/register', { method: 'POST', body: form }));
      navigate('/dashboard');
    } catch (err) {
      setStatus({ sending: false, error: err.message });
    }
  };

  return (
    <>
      <PageHeader label="(Membership) Join Kinetic" title="Join the club" accent={['club']} />
      <form onSubmit={onSubmit} className="mx-4 mb-24 grid max-w-2xl gap-7 md:mx-8">
        {status.error && <p className="rounded-2xl border border-volt p-4 text-volt" role="alert">{status.error}</p>}
        <label className="field"><span>Full name</span><input className="input" required maxLength={100} autoComplete="name" value={form.name} onChange={update('name')} /></label>
        <div className="grid gap-7 sm:grid-cols-2">
          <label className="field"><span>Email</span><input className="input" type="email" required autoComplete="email" value={form.email} onChange={update('email')} /></label>
          <label className="field"><span>Mobile</span><input className="input" type="tel" inputMode="tel" required autoComplete="tel" value={form.phone} onChange={update('phone')} /></label>
        </div>
        <label className="field"><span>Password (8+ characters)</span><input className="input" type="password" required minLength={8} autoComplete="new-password" value={form.password} onChange={update('password')} /></label>
        <label className="field">
          <span>Plan</span>
          <select className="input" value={form.plan_id} onChange={update('plan_id')}>
            <option value="">Decide later</option>
            {plans?.map((p) => <option key={p.id} value={p.id}>{p.name} · {rupees(p.monthly_price)}/month</option>)}
          </select>
        </label>
        <div className="flex flex-wrap items-center gap-6">
          <button type="submit" disabled={status.sending} className="btn btn-volt">{status.sending ? 'Creating account…' : 'Create account'} <Arrow /></button>
          <Link to="/login" className="text-sm text-bone/70 underline">Already a member? Log in</Link>
        </div>
      </form>
    </>
  );
}

export function Login() {
  const { member, saveSession } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { form, update, status, setStatus } = useForm({ email: '', password: '' });

  // Only follow same-site paths after login (blocks redirects to other websites)
  const next = params.get('next');
  const target = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
  if (member) return <Navigate to={target} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, error: null });
    try {
      saveSession(await api('/auth/login', { method: 'POST', body: form }));
      navigate(target);
    } catch (err) {
      setStatus({ sending: false, error: err.message });
    }
  };

  return (
    <>
      <PageHeader label="(Members) Log in" title="Welcome back" accent={['back']} />
      <form onSubmit={onSubmit} className="mx-4 mb-24 grid max-w-md gap-7 md:mx-8">
        {status.error && <p className="rounded-2xl border border-volt p-4 text-volt" role="alert">{status.error}</p>}
        <label className="field"><span>Email</span><input className="input" type="email" required autoComplete="email" value={form.email} onChange={update('email')} /></label>
        <label className="field"><span>Password</span><input className="input" type="password" required autoComplete="current-password" value={form.password} onChange={update('password')} /></label>
        <div className="flex flex-wrap items-center gap-6">
          <button type="submit" disabled={status.sending} className="btn btn-volt">{status.sending ? 'Logging in…' : 'Log in'} <Arrow /></button>
          <Link to="/join" className="text-sm text-bone/70 underline">New here? Join</Link>
        </div>
      </form>
    </>
  );
}
