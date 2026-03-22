import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Team from './pages/Team.jsx';
import Sponsorships from './pages/Sponsorships.jsx';
import Admin from './pages/Admin.jsx';
import RouteTransition from './components/RouteTransition.jsx';
import { useShouldReduceMotion } from './lib/motion.js';
import Fireworks from './components/Fireworks.jsx';
import { useSiteContent } from './context/useSiteContent.js';

const ScrollToTop = () => {
  const location = useLocation();
  const shouldReduceMotion = useShouldReduceMotion();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  }, [location.pathname, shouldReduceMotion]);

  return null;
};

const App = () => {
  const location = useLocation();
  const { isLoading } = useSiteContent();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sf-bg px-6 text-sf-text">
        <div className="w-full max-w-md rounded-[2rem] border border-sf-border bg-sf-surface/80 p-8 text-center shadow-[0_28px_48px_-30px_rgba(0,0,0,0.65)] backdrop-blur-sm">
          <div className="mx-auto h-14 w-14 animate-pulse rounded-full border border-sf-orange-1/35 bg-[radial-gradient(circle_at_center,rgba(248,146,33,0.45),rgba(234,80,32,0.12),transparent_72%)]" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.32rem] text-sf-orange-1/80">
            Solar Flare Robotics
          </p>
          <h1 className="mt-3 text-2xl font-bold text-sf-text">
            Loading live content
          </h1>
          <p className="mt-3 text-sm text-sf-muted sm:text-base">
            Syncing the latest website content from Firestore before rendering.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-sf-bg text-sf-text">
      <Header />
      <Fireworks />
      <ScrollToTop />
      <main className="relative z-40 flex flex-1 flex-col pt-20 sm:pt-24">
        <AnimatePresence mode="wait" initial={false}>
          <RouteTransition key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/team" element={<Team />} />
              <Route path="/sponsorships" element={<Sponsorships />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </RouteTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default App;
