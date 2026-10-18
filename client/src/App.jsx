import { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './lib/auth';
import { ScrollTrigger, scrollToId, scrollToTop, startSmoothScroll } from './lib/motion';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Blog from './pages/Blog';
import Dashboard from './pages/Dashboard';
import { Join, Login } from './pages/Auth';

function RequireAuth({ children }) {
  const { member, loading } = useAuth();
  const { pathname } = useLocation();
  if (loading) return <p className="label px-8 pt-40">Loading…</p>;
  if (!member) return <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />;
  return children;
}

function NotFound() {
  return (
    <section className="flex min-h-[80svh] flex-col items-start justify-center px-4 md:px-8">
      <p className="font-display text-[30vw] leading-none text-volt md:text-[18vw]">404</p>
      <Link to="/" className="btn btn-volt mt-6">Back to home</Link>
    </section>
  );
}

export default function App() {
  const { pathname, hash } = useLocation();

  useEffect(startSmoothScroll, []);

  // New page: jump to top, or glide to the #section in the link
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => scrollToId(hash.slice(1)), 120);
      return () => clearTimeout(t);
    }
    scrollToTop();
    return undefined;
  }, [pathname, hash]);

  // Recalculate scroll animations whenever the page height changes (images, API data loading)
  useEffect(() => {
    let timer;
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    observer.observe(document.body);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-volt focus:px-4 focus:py-2">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
