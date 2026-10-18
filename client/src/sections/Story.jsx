import { gsap, useGsap } from '../lib/motion';
import { Label, Marquee, Split, img } from '../components/ui';

// Photo that grows from a small card to full screen as you scroll
export function Showcase() {
  const scope = useGsap((el) => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: '+=120%', scrub: true, pin: true } })
        .fromTo('.sc-media', { clipPath: 'inset(20% 32% 20% 32% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' })
        .fromTo('.sc-media img', { scale: 1.35 }, { scale: 1, ease: 'none' }, 0)
        .fromTo('.sc-text', { opacity: 0, y: 80 }, { opacity: 1, y: 0, ease: 'none' }, 0.45);
    });
    mm.add('(max-width: 767px)', () => {
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', end: 'center center', scrub: true } })
        .fromTo('.sc-media', { clipPath: 'inset(12% 10% 12% 10% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' })
        .fromTo('.sc-media img', { scale: 1.25 }, { scale: 1, ease: 'none' }, 0);
    });
    return () => mm.revert();
  });

  return (
    <section ref={scope} className="relative h-svh overflow-hidden">
      <div className="sc-media absolute inset-0">
        <img src={img('1534438327276-14e5300c3a48', 1800)} alt="Rows of dumbbells on the Kinetic gym floor" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-ink/45" />
      </div>
      <div className="sc-text relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <p className="label !text-bone">The floor</p>
        <p className="mt-4 font-display text-[15vw] uppercase leading-[0.85] md:text-[9vw]">
          12,000 sq ft<br />of <span className="text-volt">serious iron</span>
        </p>
      </div>
    </section>
  );
}

export function TickerBand() {
  return (
    <div className="relative z-10 -my-6 -rotate-2 bg-volt py-3 text-ink md:py-4">
      <Marquee
        items={['Strength', 'HIIT', 'Boxing', 'Mobility', 'Powerlifting', 'Bootcamp', 'Recovery']}
        itemClass="font-display text-5xl uppercase md:text-7xl"
        sepClass="text-ink"
        speed={25}
      />
    </div>
  );
}

const MANIFESTO = "We don't sell memberships. We build habits. Real coaches on the floor, programs that progress every week, and a room full of people who show up, even on Mondays.";

export function Manifesto() {
  const scope = useGsap(() => {
    gsap.fromTo('.mf .split-inner', { opacity: 0.12 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: '.mf', start: 'top 80%', end: 'bottom 50%', scrub: true },
    });
  });
  return (
    <section ref={scope} className="px-4 py-28 md:px-8 md:py-40">
      <Label n={2}>The Kinetic way</Label>
      <p className="mf mt-8 max-w-[22ch] font-display text-[9.5vw] uppercase leading-[0.95] md:max-w-[26ch] md:text-[5.2vw]">
        <Split text={MANIFESTO} accent={['habits.', 'Mondays.']} />
      </p>
    </section>
  );
}

const STATS = [
  [2500, '+', 'Members training'],
  [15, '', 'Certified coaches'],
  [60, '+', 'Classes every week'],
  [24, '/7', 'Access on Pro & Elite'],
];

export function Stats() {
  const scope = useGsap(() => {
    gsap.utils.toArray('.stat-num').forEach((el) => {
      const end = Number(el.dataset.to);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration: 1.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('en-IN'); },
      });
    });
    gsap.from('.stat', { y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.stats-grid', start: 'top 85%' } });
  });
  return (
    <section ref={scope} className="px-4 pb-24 md:px-8 md:pb-32">
      <div className="stats-grid grid grid-cols-2 border-t border-bone/15 md:grid-cols-4">
        {STATS.map(([n, suffix, label]) => (
          <div key={label} className="stat border-b border-bone/15 py-8 pr-4 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
            <p className="font-display text-[17vw] leading-none md:text-[7vw]">
              <span className="stat-num" data-to={n}>{n.toLocaleString('en-IN')}</span><span className="text-volt">{suffix}</span>
            </p>
            <p className="label mt-3">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
