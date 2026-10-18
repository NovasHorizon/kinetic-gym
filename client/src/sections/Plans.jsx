import { useState } from 'react';
import { Link } from 'react-router-dom';
import { rupees, useApi } from '../lib/api';
import { gsap, useGsap } from '../lib/motion';
import { Arrow, Label } from '../components/ui';

const STYLES = [
  'bg-bone text-ink',
  'bg-volt text-white',
  'bg-ink-2 text-bone border border-bone/15',
];

export default function Plans() {
  const { data: plans, error } = useApi('/plans');
  const [yearly, setYearly] = useState(false);

  // Each card shrinks and dims as the next one slides over it
  const scope = useGsap(() => {
    if (!plans) return;
    const cards = gsap.utils.toArray('.plan-card');
    cards.slice(0, -1).forEach((card, i) => {
      gsap.to(card, {
        scale: 0.9, opacity: 0.4, ease: 'none',
        scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 20%', scrub: true },
      });
    });
  }, [plans]);

  return (
    <section id="plans" ref={scope} className="px-4 py-24 md:px-8 md:py-32">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Label n={4}>Membership</Label>
          <h2 className="mt-4 font-display text-[13vw] uppercase leading-[0.88] md:text-[5.5vw]">Pick your <span className="text-volt">plan</span></h2>
        </div>
        <div className="flex rounded-full border border-bone/20 p-1 text-sm font-bold uppercase tracking-[0.1em]" role="group" aria-label="Billing period">
          <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)} className={`rounded-full px-5 py-2.5 transition ${yearly ? 'text-bone/60' : 'bg-bone text-ink'}`}>Monthly</button>
          <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)} className={`rounded-full px-5 py-2.5 transition ${yearly ? 'bg-bone text-ink' : 'text-bone/60'}`}>Yearly −20%</button>
        </div>
      </div>

      {error && <p className="text-volt">Couldn't load plans: {error.message}</p>}
      {!plans && !error && <p className="label">Loading plans…</p>}

      <div className="space-y-6 pb-[6vh]">
        {plans?.map((plan, i) => (
          <article
            key={plan.id}
            className={`plan-card sticky grid min-h-[72svh] origin-top gap-8 rounded-[2rem] p-6 shadow-2xl md:min-h-[68vh] md:grid-cols-2 md:p-12 ${STYLES[i % STYLES.length]}`}
            style={{ top: `calc(10svh + ${i * 18}px)` }}
          >
            <div className="flex flex-col justify-between gap-6">
              <div>
                {plan.is_featured && <span className="mb-4 inline-block rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-bone">Most popular</span>}
                <h3 className="font-display text-[24vw] uppercase leading-[0.8] md:text-[9vw]">{plan.name}</h3>
                <p className="mt-3 max-w-xs opacity-75">{plan.description}</p>
              </div>
              <p className="font-display text-6xl leading-none md:text-8xl">
                {rupees(yearly ? plan.yearly_price : plan.monthly_price)}<span className="font-sans text-base font-medium opacity-70"> /month</span>
              </p>
            </div>
            <div className="flex flex-col justify-between gap-6">
              <ul className="space-y-3 border-t border-current/20 pt-6 text-base md:text-lg">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3"><span aria-hidden="true">✺</span>{f}</li>
                ))}
              </ul>
              <div>
                <p className="mb-4 text-sm opacity-70">{yearly ? `Billed ${rupees(plan.yearly_price * 12)} yearly` : 'No joining fee this month'}</p>
                <Link to={`/join?plan=${plan.id}`} className={`btn ${i === 1 ? 'bg-ink text-bone hover:bg-bone hover:text-ink' : 'btn-volt'}`}>Choose {plan.name} <Arrow /></Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
