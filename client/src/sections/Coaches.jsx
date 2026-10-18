import { useEffect, useRef, useState } from 'react';
import { useApi } from '../lib/api';
import { gsap, reduceMotion, useGsap } from '../lib/motion';
import { Label } from '../components/ui';

export default function Coaches() {
  const { data: trainers, error } = useApi('/trainers');
  const [active, setActive] = useState(null);
  const preview = useRef(null);

  // Desktop: a photo of the hovered coach follows the mouse
  useEffect(() => {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const x = gsap.quickTo(preview.current, 'x', { duration: 0.6, ease: 'power3' });
    const y = gsap.quickTo(preview.current, 'y', { duration: 0.6, ease: 'power3' });
    const move = (e) => { x(e.clientX + 30); y(e.clientY - 180); };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useEffect(() => {
    gsap.to(preview.current, { autoAlpha: active ? 1 : 0, scale: active ? 1 : 0.8, rotate: active ? -4 : 0, duration: 0.4, ease: 'power3.out' });
  }, [active]);

  const scope = useGsap(() => {
    if (!trainers) return;
    gsap.from('.coach-row', { yPercent: 60, opacity: 0, stagger: 0.08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.coach-list', start: 'top 85%' } });
  }, [trainers]);

  return (
    <section id="coaches" ref={scope} className="px-4 py-24 md:px-8 md:py-32">
      <Label n={5}>Coaches</Label>
      <h2 className="mt-4 font-display text-[13vw] uppercase leading-[0.88] md:text-[5.5vw]">The people<br />in your <span className="text-volt">corner</span></h2>

      {error && <p className="mt-6 text-volt">Couldn't load coaches: {error.message}</p>}

      <ul className="coach-list mt-12 border-b border-bone/15" onPointerLeave={() => setActive(null)}>
        {trainers?.map((t, i) => (
          <li
            key={t.id}
            data-cursor
            onPointerEnter={() => setActive(t)}
            className="coach-row group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-bone/15 py-5 md:gap-8 md:py-7"
          >
            <span className="label w-8">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <p className="font-display text-[10vw] uppercase leading-[0.9] transition-all duration-500 group-hover:translate-x-3 group-hover:text-volt md:text-[5.5vw]">{t.name}</p>
              <p className="mt-1 text-sm text-bone/60 md:hidden">{t.specialty} · {t.experience_years} yrs</p>
            </div>
            <div className="text-right">
              <img src={t.photo_url} alt={`Coach ${t.name}`} className="size-16 rounded-xl object-cover md:hidden" loading="lazy" />
              <p className="hidden text-sm font-medium md:block">{t.specialty}</p>
              <p className="label mt-1 hidden md:block">{t.experience_years} years coaching</p>
            </div>
          </li>
        ))}
      </ul>

      <div ref={preview} className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[340px] w-[260px] overflow-hidden rounded-2xl opacity-0 shadow-2xl md:block" aria-hidden="true">
        {active && <img src={active.photo_url} alt="" className="h-full w-full object-cover" />}
      </div>
    </section>
  );
}
