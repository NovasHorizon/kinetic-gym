import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { gsap, lockScroll, reduceMotion } from '../lib/motion';
import { Magnetic } from './ui';

const LINKS = [
  ['Home', '/'],
  ['Programs', '/#programs'],
  ['Membership', '/#plans'],
  ['Timetable', '/schedule'],
  ['Coaches', '/#coaches'],
  ['Journal', '/blog'],
];

export function Logo({ className = '' }) {
  return <span className={`font-display text-2xl tracking-wide ${className}`}>KINETIC<sup className="text-volt text-xs">®</sup></span>;
}

export default function Nav() {
  const { member, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const menu = useRef(null);
  const tl = useRef(null);

  useEffect(() => setOpen(false), [pathname, hash]);

  // Build the open/close animation once
  useEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true })
        .set(menu.current, { visibility: 'visible' })
        .fromTo(menu.current, { clipPath: 'circle(0% at calc(100% - 40px) 36px)' }, { clipPath: 'circle(150% at calc(100% - 40px) 36px)', duration: 0.9, ease: 'expo.inOut' })
        .from('.menu-link .split-inner', { yPercent: 110, stagger: 0.05, duration: 0.7, ease: 'power4.out' }, '-=0.45')
        .from('.menu-meta', { opacity: 0, y: 20, stagger: 0.05, duration: 0.5 }, '-=0.5');
    }, menu);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!tl.current) return;
    if (reduceMotion) {
      gsap.set(menu.current, { visibility: open ? 'visible' : 'hidden', clipPath: 'none' });
      return;
    }
    open ? tl.current.timeScale(1).play() : tl.current.timeScale(1.6).reverse();
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Blend mode keeps the header readable over any photo, but it turns cyan on the orange menu, so it's off while the menu is open */}
      <header className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 md:px-8 ${open ? '' : 'mix-blend-difference'}`}>
        <Link to="/" aria-label="Kinetic home" className="text-bone"><Logo /></Link>
        <div className="flex items-center gap-2 md:gap-3">
          {!member && (
            <Link to="/join" className="hidden text-sm font-bold uppercase tracking-[0.12em] text-bone sm:inline">Join</Link>
          )}
          <Magnetic>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex items-center gap-3 rounded-full border border-bone/40 px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-bone"
            >
              {open ? 'Close' : 'Menu'}
              <span className="relative block h-2.5 w-5" aria-hidden="true">
                <span className={`absolute left-0 h-0.5 w-5 bg-bone transition-all duration-300 ${open ? 'top-1 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-0.5 w-5 bg-bone transition-all duration-300 ${open ? 'top-1 -rotate-45' : 'top-2'}`} />
              </span>
            </button>
          </Magnetic>
        </div>
      </header>

      <nav
        id="site-menu"
        ref={menu}
        aria-label="Main"
        aria-hidden={!open}
        onClick={(e) => e.target.closest("a, button") && setOpen(false)}
        className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-volt px-4 pb-8 pt-24 text-ink md:px-8"
        style={{ visibility: 'hidden' }}
      >
        <ul className="space-y-1">
          {LINKS.map(([label, to]) => (
            <li key={to} className="menu-link">
              <Link to={to} tabIndex={open ? 0 : -1} className="inline-flex font-display text-[15vw] uppercase leading-[0.9] transition-transform duration-300 hover:translate-x-4 md:text-[7.5vw]">
                <span className="split-word"><span className="split-inner">{label}</span></span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-6 text-sm font-medium md:grid-cols-3">
          <div className="menu-meta">
            <p className="label !text-ink/60">Account</p>
            {member ? (
              <div className="mt-2 flex flex-wrap gap-4">
                <Link to="/dashboard" tabIndex={open ? 0 : -1} className="underline">My account</Link>
                <button type="button" tabIndex={open ? 0 : -1} onClick={logout} className="underline">Log out</button>
              </div>
            ) : (
              <div className="mt-2 flex flex-wrap gap-4">
                <Link to="/join" tabIndex={open ? 0 : -1} className="underline">Become a member</Link>
                <Link to="/login" tabIndex={open ? 0 : -1} className="underline">Log in</Link>
              </div>
            )}
          </div>
          <div className="menu-meta">
            <p className="label !text-ink/60">Visit</p>
            <p className="mt-2">Baner Road, Pune · Mon to Sat 5 am to 11 pm</p>
          </div>
          <div className="menu-meta">
            <p className="label !text-ink/60">First session</p>
            <Link to="/#trial" tabIndex={open ? 0 : -1} className="mt-2 inline-block underline">Book it free →</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
