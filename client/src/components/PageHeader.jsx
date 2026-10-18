import { gsap, useGsap } from '../lib/motion';
import { Split } from './ui';

// Big animated title used at the top of inner pages
export default function PageHeader({ label, title, accent = [], children }) {
  const scope = useGsap(() => {
    gsap.from('.ph-title .split-inner', { yPercent: 110, stagger: 0.05, duration: 1, ease: 'power4.out', delay: 0.1 });
    gsap.from('.ph-fade', { opacity: 0, y: 20, duration: 0.8, delay: 0.4 });
  });
  return (
    <header ref={scope} className="px-4 pb-10 pt-28 md:px-8 md:pt-36">
      <p className="ph-fade label">{label}</p>
      <h1 className="ph-title mt-4 font-display text-[16vw] uppercase leading-[0.85] md:text-[8vw]">
        <Split text={title} accent={accent} />
      </h1>
      {children && <div className="ph-fade mt-6 max-w-xl text-bone/70">{children}</div>}
    </header>
  );
}
