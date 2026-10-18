import { Link } from 'react-router-dom';
import { gsap, useGsap } from '../lib/motion';
import { Arrow, Magnetic } from './ui';

export default function Footer() {
  // Giant wordmark rises letter by letter as the footer comes into view
  const scope = useGsap(() => {
    gsap.from('.ft-letter', {
      yPercent: 100, stagger: 0.04, ease: 'power4.out', duration: 1,
      scrollTrigger: { trigger: '.ft-word', start: 'top 95%' },
    });
  });

  return (
    <footer ref={scope} className="relative overflow-hidden bg-ink-2 px-4 pb-6 pt-20 md:px-8 md:pt-28">
      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl uppercase leading-none md:text-6xl">Ready when<br /><span className="text-volt">you are.</span></p>
          <div className="mt-6">
            <Magnetic>
              <Link to="/#trial" className="btn btn-volt">Book a free session <Arrow /></Link>
            </Magnetic>
          </div>
        </div>
        <div className="text-sm">
          <p className="label">Explore</p>
          <ul className="mt-3 space-y-2">
            <li><Link to="/#programs" className="hover:text-volt">Programs</Link></li>
            <li><Link to="/#plans" className="hover:text-volt">Membership</Link></li>
            <li><Link to="/schedule" className="hover:text-volt">Timetable</Link></li>
            <li><Link to="/blog" className="hover:text-volt">Journal</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="label">Members</p>
          <ul className="mt-3 space-y-2">
            <li><Link to="/join" className="hover:text-volt">Join</Link></li>
            <li><Link to="/login" className="hover:text-volt">Log in</Link></li>
            <li><Link to="/dashboard" className="hover:text-volt">My bookings</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="label">Hours</p>
          <p className="mt-3 text-bone/70">Mon to Sat: 5 am to 11 pm<br />Sunday: 7 am to 1 pm<br />24/7 for Pro and Elite</p>
        </div>
      </div>

      <div className="ft-word mt-16 select-none font-display text-[35.5vw] uppercase leading-[0.8] tracking-tight text-bone md:mt-24" aria-hidden="true">
        {[...'KINETIC'].map((c, i) => (
          <span key={i} className="split-word"><span className="ft-letter split-inner">{c}</span></span>
        ))}
      </div>
      <div className="mt-6 flex flex-col justify-between gap-2 border-t border-bone/10 pt-5 text-xs text-ash md:flex-row">
        <p>© {new Date().getFullYear()} Kinetic Performance Club. Demo project.</p>
        <p>React · Tailwind CSS · GSAP · Laravel · MySQL</p>
      </div>
    </footer>
  );
}
