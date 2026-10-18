import { useState } from 'react';
import { api } from '../lib/api';
import { gsap, useGsap } from '../lib/motion';
import { Arrow, Label, Marquee, Split } from '../components/ui';

// ---------- BMI with sliders: updates live, easy with a thumb on a phone ----------
const BANDS = [
  { max: 18.5, label: 'Underweight', color: '#38bdf8', tip: 'Strength training plus a calorie-surplus plan will help you build healthy mass.' },
  { max: 25, label: 'Healthy', color: '#a3e635', tip: 'Great base. Strength and HIIT will help you build muscle and stay lean.' },
  { max: 30, label: 'Overweight', color: '#fbbf24', tip: 'HIIT plus a coach-built diet plan is the fastest, safest way to bring this down.' },
  { max: Infinity, label: 'Obese', color: '#ff4b1f', tip: 'Start with guided 1-on-1 training. We will build a safe, gradual plan.' },
];

export function BmiTool() {
  const [height, setHeight] = useState(172);
  const [weight, setWeight] = useState(72);
  const bmi = weight / (height / 100) ** 2;
  const band = BANDS.find((b) => bmi < b.max);
  const pin = Math.min(Math.max((bmi - 15) / 25, 0), 1) * 100;

  return (
    <section className="grid gap-12 bg-ink-2 px-4 py-24 md:grid-cols-2 md:px-8 md:py-32">
      <div>
        <Label n={6}>Free tool</Label>
        <h2 className="mt-4 font-display text-[13vw] uppercase leading-[0.88] md:text-[5.5vw]">Know your<br /><span className="text-volt">numbers</span></h2>
        <p className="mt-6 max-w-sm text-bone/70">Drag the sliders. Your Body Mass Index updates live. It's a rough guide, so our coaches also do a full body assessment on day one.</p>
      </div>
      <div aria-live="polite">
        <p className="font-display text-[30vw] leading-[0.8] md:text-[11vw]" style={{ color: band.color }}>{bmi.toFixed(1)}</p>
        <p className="label mt-2 !text-bone">{band.label}</p>
        <div className="relative mt-6 h-2 rounded-full" style={{ background: 'linear-gradient(90deg,#38bdf8 0 14%,#a3e635 14% 40%,#fbbf24 40% 60%,#ff4b1f 60%)' }}>
          <span className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ink-2 bg-bone transition-[left] duration-300" style={{ left: `${pin}%` }} />
        </div>
        <p className="mt-6 text-bone/80">{band.tip}</p>
        <div className="mt-10 space-y-8">
          <label className="block">
            <span className="flex justify-between text-sm"><span className="label">Height</span><span className="font-bold">{height} cm</span></span>
            <input type="range" min="140" max="210" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="range mt-4" aria-label="Height in centimetres" />
          </label>
          <label className="block">
            <span className="flex justify-between text-sm"><span className="label">Weight</span><span className="font-bold">{weight} kg</span></span>
            <input type="range" min="35" max="160" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="range mt-4" aria-label="Weight in kilograms" />
          </label>
        </div>
      </div>
    </section>
  );
}

// ---------- Reviews scrolling in two directions ----------
const REVIEWS = [
  ['−14 kg', 'Lost 14 kg in five months without a single crash diet. The meal plan was home food I actually enjoy.', 'Pooja S.'],
  ['+40 kg squat', 'Tried three gyms before this one. The coaching is the difference. New PR every month since I joined.', 'Aditya K.'],
  ['150+ classes', 'The 6 am HIIT class is the best part of my day. The energy in that room keeps me coming back.', 'Karan M.'],
  ['First pull-up', 'At 34 I did my first ever pull-up. Sneha and the mobility classes fixed my shoulders.', 'Meera J.'],
  ['Zero to 10K', 'Started with bootcamp, now I run 10K every Sunday. Never thought I would say that.', 'Rahul D.'],
];

const reviewCard = ([result, quote, name]) => (
  <figure className="mx-2 w-[82vw] rounded-3xl border border-bone/15 bg-ink p-6 md:mx-3 md:w-[420px] md:p-8">
    <p className="font-display text-4xl uppercase text-volt">{result}</p>
    <blockquote className="mt-4 text-bone/85">“{quote}”</blockquote>
    <figcaption className="label mt-6">{name}</figcaption>
  </figure>
);

export function Reviews() {
  return (
    <section className="overflow-hidden py-24 md:py-32">
      <div className="px-4 md:px-8">
        <Label n={7}>Results</Label>
        <h2 className="mt-4 font-display text-[13vw] uppercase leading-[0.88] md:text-[5.5vw]">Real people.<br /><span className="text-volt">Real numbers.</span></h2>
      </div>
      <div className="mt-12 space-y-4 md:space-y-6">
        <Marquee items={REVIEWS.map(reviewCard)} separator={null} speed={55} pausable />
        <Marquee items={[...REVIEWS].reverse().map(reviewCard)} separator={null} speed={65} reverse pausable />
      </div>
    </section>
  );
}

// ---------- Free trial form ----------
const GOALS = ['Lose weight', 'Build muscle', 'Get fit and active', 'Train for a sport'];
const PLANS = ['Not sure yet', 'Basic', 'Pro', 'Elite'];
const TIMES = ['Morning (6 to 10 am)', 'Afternoon (12 to 4 pm)', 'Evening (5 to 10 pm)'];
const EMPTY = { name: '', phone: '', goal: GOALS[0], plan: PLANS[0], preferred_time: TIMES[0] };

export function Trial() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ sending: false, error: null, success: null });
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const scope = useGsap(() => {
    gsap.from('.trial-title .split-inner', { yPercent: 110, stagger: 0.06, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: '.trial-title', start: 'top 85%' } });
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, error: null, success: null });
    try {
      const res = await api('/enquiries', { method: 'POST', body: form });
      setStatus({ sending: false, error: null, success: res.message });
      setForm(EMPTY);
    } catch (err) {
      setStatus({ sending: false, error: err.message, success: null });
    }
  };

  return (
    <section id="trial" ref={scope} className="grid gap-12 px-4 py-24 md:grid-cols-2 md:px-8 md:py-32">
      <div>
        <Label n={8}>First session free</Label>
        <h2 className="trial-title mt-4 font-display text-[16vw] uppercase leading-[0.85] md:text-[7vw]">
          <Split text="Your first workout is on us" accent={['on', 'us']} />
        </h2>
        <p className="mt-6 max-w-sm text-bone/70">Tour, body assessment and a coached session. No payment, no pressure. We call within 24 hours to fix a time.</p>
      </div>
      <form onSubmit={onSubmit} className="grid content-start gap-7">
        {status.success && <p className="rounded-2xl bg-volt p-4 font-medium text-white" role="status">{status.success}</p>}
        {status.error && <p className="rounded-2xl border border-volt p-4 text-volt" role="alert">{status.error}</p>}
        <label className="field"><span>Full name</span><input className="input" required maxLength={100} autoComplete="name" value={form.name} onChange={update('name')} /></label>
        <label className="field"><span>Mobile number</span><input className="input" type="tel" inputMode="tel" required autoComplete="tel" placeholder="10-digit mobile" value={form.phone} onChange={update('phone')} /></label>
        <div className="grid gap-7 sm:grid-cols-2">
          <label className="field"><span>Goal</span><select className="input" value={form.goal} onChange={update('goal')}>{GOALS.map((g) => <option key={g}>{g}</option>)}</select></label>
          <label className="field"><span>Plan</span><select className="input" value={form.plan} onChange={update('plan')}>{PLANS.map((p) => <option key={p}>{p}</option>)}</select></label>
        </div>
        <label className="field"><span>Preferred time</span><select className="input" value={form.preferred_time} onChange={update('preferred_time')}>{TIMES.map((t) => <option key={t}>{t}</option>)}</select></label>
        <button type="submit" disabled={status.sending} className="btn btn-volt mt-2 w-full sm:w-auto sm:justify-self-start">
          {status.sending ? 'Sending…' : 'Book my free session'} <Arrow />
        </button>
      </form>
    </section>
  );
}
