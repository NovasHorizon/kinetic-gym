import { gsap, useGsap } from '../lib/motion';
import { Label, img } from '../components/ui';

const PROGRAMS = [
  ['Strength', 'Build muscle', 'Progressive barbell programs that make every week stronger than the last.', '60 min · All levels', '1541534741688-6078c6bfb5c5'],
  ['HIIT Burn', 'Burn fat', 'Ropes, sleds and bikes in short, savage intervals. Maximum output, minimum time.', '45 min · Intermediate', '1599058917212-d750089bc07e'],
  ['Kickboxing', 'Fight fit', 'Pad work, footwork and fight conditioning that builds confidence and cardio.', '60 min · All levels', '1599552683573-9dc48255fe85'],
  ['Mobility', 'Recover', 'Open up tight hips and shoulders. Breathe better, move without pain.', '60 min · All levels', '1544367567-0f2fcb009e0b'],
  ['Bootcamp', 'Stay motivated', 'Team circuits with music, energy and people who refuse to quit.', '45 min · All levels', '1518310383802-640c2de311b2'],
  ['1-on-1', 'Personal', 'A coach, a plan and real accountability built around your body and goals.', 'Your schedule', '1584466977773-e625c37cdd50'],
];

export default function Programs() {
  const scope = useGsap((el) => {
    const mm = gsap.matchMedia();
    // Desktop: the section pins and the cards slide sideways as you scroll down
    mm.add('(min-width: 768px)', () => {
      const track = el.querySelector('.pg-track');
      const distance = () => track.scrollWidth - window.innerWidth;
      const slide = gsap.to(track, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
      });
      gsap.utils.toArray('.pg-card img').forEach((image) => {
        gsap.fromTo(image, { xPercent: -8 }, {
          xPercent: 8, ease: 'none',
          scrollTrigger: { trigger: image.parentElement, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
        });
      });
      gsap.to('.pg-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance()}`, scrub: true } });
    });
    // Phones: cards rise in as they enter
    mm.add('(max-width: 767px)', () => {
      gsap.from('.pg-head', { y: 40, opacity: 0, duration: 1, scrollTrigger: { trigger: el, start: 'top 80%' } });
    });
    return () => mm.revert();
  });

  return (
    <section id="programs" ref={scope} className="relative overflow-hidden py-20 md:flex md:h-svh md:flex-col md:justify-center md:py-0">
      <div className="pg-head mb-8 flex items-end justify-between gap-6 px-4 md:mb-10 md:px-8">
        <div>
          <Label n={3}>Programs</Label>
          <h2 className="mt-4 font-display text-[13vw] uppercase leading-[0.88] md:text-[5.5vw]">Six ways to<br />get <span className="text-volt">stronger</span></h2>
        </div>
        <p className="hidden max-w-xs text-bone/60 md:block">Pick one. Mix them. Your coach builds the plan around your goal.</p>
      </div>

      <div className="pg-track flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:w-max md:snap-none md:overflow-visible md:px-8 md:pb-0">
        {PROGRAMS.map(([title, tag, text, meta, photo], i) => (
          <article key={title} className="pg-card group relative h-[64vh] w-[80vw] shrink-0 snap-start overflow-hidden rounded-3xl bg-ink-2 md:h-[58vh] md:w-[32vw]">
            <img src={img(photo, 900, 1100)} alt={`${title} class at Kinetic`} loading="lazy" className="absolute -left-[10%] top-0 h-full w-[120%] max-w-none object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
              <div className="flex items-start justify-between">
                <span className="font-display text-5xl text-volt">{String(i + 1).padStart(2, '0')}</span>
                <span className="rounded-full border border-bone/30 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur">{tag}</span>
              </div>
              <div>
                <h3 className="font-display text-5xl uppercase leading-none md:text-6xl">{title}</h3>
                <p className="mt-3 max-w-[32ch] text-sm text-bone/75">{text}</p>
                <p className="label mt-4 !text-bone/60">{meta}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="label mt-4 px-4 md:hidden">Swipe →</p>
      <div className="mx-8 mt-8 hidden h-px bg-bone/15 md:block"><div className="pg-progress h-px origin-left scale-x-0 bg-volt" /></div>
    </section>
  );
}
