import { useCallback, useState } from 'react';
import { reduceMotion } from '../lib/motion';
import Preloader from '../components/Preloader';
import Hero from '../sections/Hero';
import { Manifesto, Showcase, Stats, TickerBand } from '../sections/Story';
import Programs from '../sections/Programs';
import Plans from '../sections/Plans';
import Coaches from '../sections/Coaches';
import { BmiTool, Reviews, Trial } from '../sections/Extras';

const seenIntro = () => {
  try { return Boolean(sessionStorage.getItem('kinetic_seen')); } catch { return true; }
};

export default function Home() {
  const [loading, setLoading] = useState(() => !reduceMotion && !seenIntro());
  const done = useCallback(() => {
    try { sessionStorage.setItem('kinetic_seen', '1'); } catch { /* private mode */ }
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <Preloader onDone={done} />}
      <Hero ready={!loading} />
      <Showcase />
      <TickerBand />
      <Manifesto />
      <Stats />
      <Programs />
      <Plans />
      <Coaches />
      <BmiTool />
      <Reviews />
      <Trial />
    </>
  );
}
