import { Link } from 'react-router-dom';
import { gsap, useGsap } from '../lib/motion';
import { Arrow, Magnetic, Split, img } from '../components/ui';

const ROTATING = ['day', 'rep', 'set', 'week'];

export default function Hero({ ready }) {
  const scope = useGsap((el) => {
    if (!ready) {
      // hidden until the intro loader finishes
      gsap.set('.hero-line .split-inner', { yPercent: 110 });
      gsap.set('.hero-pill', { scaleX: 0 });
      gsap.set('.hero-fade', { opacity: 0 });
      return undefined;
    }
    gsap.timeline({ delay: 0.1 })
      .from('.hero-line .split-inner', { yPercent: 110, duration: 1.1, stagger: 0.03, ease: 'power4.out' })
      .from('.hero-pill', { scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease: 'expo.out' }, 0.35)
      .from('.hero-fade', { opacity: 0, y: 24, stagger: 0.08, duration: 0.8, ease: 'power3.out' }, 0.6);

    // Rotating last word: DAY -> REP -> SET -> WEEK
    const words = gsap.utils.toArray('.rot-word');
    const rot = gsap.timeline({ repeat: -1, delay: 2 });
    words.forEach((w, i) => {
      const next = words[(i + 1) % words.length];
      rot.to(w, { yPercent: -110, duration: 0.6, ease: 'power3.inOut' }, '+=1.4')
        // immediateRender: false keeps "day" visible at the start instead of hiding it until the loop wraps
        .fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: 'power3.inOut', immediateRender: false }, '<');
    });

    // Headline drifts up and fades as you scroll away
    gsap.to('.hero-title', {
      yPercent: -18, opacity: 0.2, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    });
    return undefined;
  }, [ready]);

  return (
    <section ref={scope} className="relative flex min-h-svh flex-col justify-between overflow-hidden px-4 pb-8 pt-24 md:px-8 md:pt-28">
      <div className="pointer-events-none absolute -right-[20vw] -top-[20vw] size-[60vw] rounded-full bg-volt/20 blur-[120px]" aria-hidden="true" />

      <div className="hero-fade label flex justify-between">
        <span>Performance club · Pune</span>
        <span className="hidden sm:block">Est. 2016 · Open till 11 pm</span>
      </div>

      <h1 className="hero-title relative my-8 font-display text-[17vw] uppercase leading-[0.84] tracking-tight md:text-[12.5vw]" aria-label="Stronger every single day">
        <span className="hero-line block" aria-hidden="true"><Split text="Stronger" chars /></span>
        <span className="hero-line flex items-center gap-[2.5vw]" aria-hidden="true">
          <span className="hero-pill inline-block h-[0.74em] w-[1.7em] overflow-hidden rounded-full">
            <img src={img('1605296867304-46d5465a13f1', 700, 400)} alt="" className="h-full w-full object-cover" fetchpriority="high" />
          </span>
          <Split text="every" chars />
        </span>
        <span className="hero-line block" aria-hidden="true">
          <Split text="single" chars />{' '}
          <span className="split-word relative text-volt">
            <span className="invisible">week</span>
            {ROTATING.map((w, i) => (
              <span key={w} className="rot-word absolute inset-0" style={i ? { transform: 'translateY(110%)' } : undefined}>{w}</span>
            ))}
          </span>
        </span>
      </h1>

      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <p className="hero-fade max-w-md text-base text-bone/75 md:text-lg">
          A performance gym for people who'd rather earn it. Strength, conditioning, combat and recovery under one roof, with coaches who actually coach.
        </p>
        <div className="hero-fade flex flex-wrap gap-3">
          <Magnetic><Link to="/#trial" className="btn btn-volt">Claim free session <Arrow /></Link></Magnetic>
          <Link to="/schedule" className="btn btn-ghost">Timetable</Link>
        </div>
      </div>
    </section>
  );
}
