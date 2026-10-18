import { useEffect, useRef } from 'react';
import { gsap, reduceMotion } from '../lib/motion';

// Splits text into words (or letters) inside clipping boxes so they can slide up into view.
// Screen readers get the plain sentence via aria-label.
export function Split({ text, chars = false, className = '', accent = [] }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text} role="text">
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span className={`split-word ${accent.includes(word) ? 'text-volt' : ''}`}>
            {chars
              ? [...word].map((c, j) => <span key={j} className="split-inner">{c}</span>)
              : <span className="split-inner">{word}</span>}
          </span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
}

// Endless horizontal ticker. Items are rendered twice so the loop is seamless.
export function Marquee({ items, speed = 30, reverse = false, pausable = false, className = '', itemClass = '', separator = '✺', sepClass = 'text-volt' }) {
  const row = items.flatMap((item, i) => [
    <div key={`i${i}`} className={itemClass}>{item}</div>,
    separator && <span key={`s${i}`} className={`px-[0.4em] ${sepClass}`}>{separator}</span>,
  ]);
  return (
    <div className={`marquee overflow-hidden ${className}`} aria-hidden="true">
      <div className={`marquee-track ${reverse ? 'reverse' : ''} ${pausable ? 'pausable' : ''}`} style={{ '--speed': `${speed}s` }}>
        <div className="flex shrink-0 items-center">{row}</div>
        <div className="flex shrink-0 items-center">{row}</div>
      </div>
    </div>
  );
}

// Button/link that leans toward the mouse pointer.
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * strength);
      y((e.clientY - r.top - r.height / 2) * strength);
    };
    const leave = () => { x(0); y(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);
  return <span ref={ref} className="inline-block">{children}</span>;
}

export function Arrow({ className = 'size-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// "(03)  Programs" style section label
export function Label({ n, children, className = '' }) {
  return (
    <p className={`label flex items-center gap-3 ${className}`}>
      <span className="text-volt">({String(n).padStart(2, '0')})</span>
      <span className="h-px w-8 bg-current opacity-40" />
      {children}
    </p>
  );
}

export const img = (id, w = 1200, h) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=70`;
