import { useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true }); // phone address bars resizing shouldn't restart animations

export const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- smooth scrolling (Lenis), kept in sync with GSAP ScrollTrigger ----------
export let lenis = null;

export function startSmoothScroll() {
  if (reduceMotion || lenis) return;
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -70 });
  else el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

export const lockScroll = (locked) => {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
};

// ---------- runs GSAP code scoped to a component and cleans it up on unmount ----------
// fn(scopeElement) may return a cleanup function (e.g. matchMedia.revert).
export function useGsap(fn, deps = []) {
  const scope = useRef(null);
  useLayoutEffect(() => {
    if (reduceMotion) return undefined;
    let cleanup;
    const ctx = gsap.context(() => {
      cleanup = fn(scope.current);
    }, scope);
    return () => {
      cleanup?.();
      ctx.revert();
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return scope;
}

export { gsap, ScrollTrigger };
