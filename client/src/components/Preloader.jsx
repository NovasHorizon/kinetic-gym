import { useLayoutEffect, useRef } from 'react';
import { gsap, lockScroll } from '../lib/motion';

// Orange curtain with a 0-100 counter, shown once per visit on the home page.
export default function Preloader({ onDone }) {
  const root = useRef(null);
  const num = useRef(null);

  useLayoutEffect(() => {
    lockScroll(true);
    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.timeline({ onComplete: () => { lockScroll(false); onDone(); } })
        .from('.pl-letter', { yPercent: 110, stagger: 0.05, duration: 0.7, ease: 'power4.out' })
        .to(counter, {
          v: 100, duration: 1.2, ease: 'power2.inOut',
          onUpdate: () => { num.current.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
        }, 0)
        .to('.pl-letter', { yPercent: -110, stagger: 0.03, duration: 0.45, ease: 'power3.in' }, '-=0.15')
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.2');
    }, root);
    return () => { ctx.revert(); lockScroll(false); };
  }, [onDone]);

  return (
    <div ref={root} className="fixed inset-0 z-[90] flex flex-col justify-between bg-volt p-5 text-ink md:p-8" style={{ clipPath: 'inset(0 0 0% 0)' }} aria-hidden="true">
      <p className="label !text-ink">Kinetic Performance Club · Pune</p>
      <div className="flex items-end justify-between">
        <div className="font-display text-[22vw] leading-[0.8] md:text-[14vw]">
          {[...'KINETIC'].map((c, i) => (
            <span key={i} className="split-word"><span className="pl-letter split-inner">{c}</span></span>
          ))}
        </div>
        <span ref={num} className="font-display text-[10vw] leading-none md:text-[5vw]">000</span>
      </div>
    </div>
  );
}
