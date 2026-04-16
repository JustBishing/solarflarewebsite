import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Team from './pages/Team.jsx';
import PastSeasons from './pages/PastSeasons.jsx';
import Sponsorships from './pages/Sponsorships.jsx';
import Admin from './pages/Admin.jsx';
import Branding from './pages/Branding.jsx';
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
  const { hasCachedContent, isLoading } = useSiteContent();

  if (isLoading && !hasCachedContent) {
    return (
      <div className="min-h-screen bg-sf-bg text-sf-text">
        <div className="h-1 w-full overflow-hidden bg-white/5">
          <div className="h-full w-1/3 animate-[pulse_1.2s_ease-in-out_infinite] bg-[linear-gradient(90deg,rgba(234,80,32,0),rgba(234,80,32,0.85),rgba(248,146,33,0))]" />
        </div>
        <div className="flex min-h-[calc(100vh-4px)] items-center justify-center px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.32rem] text-sf-orange-1/80">
              Solar Flare Robotics
            </p>
            <p className="mt-4 text-sm text-sf-muted sm:text-base">
              Loading live content...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col text-sf-text">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-16 right-[-5%] h-[32vh] w-[32vh] rounded-full bg-sf-orange-1/18 blur-3xl animate-aura-drift" />
        <div className="absolute top-[35%] left-[-8%] h-[28vh] w-[28vh] rounded-full bg-sf-orange-2/12 blur-3xl animate-aura-drift-slow" />
        <div className="absolute bottom-[-10%] left-[35%] h-[34vh] w-[34vh] rounded-full bg-red-600/12 blur-3xl animate-aura-drift" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.65)_75%)]" />
      </div>
      <Header />
      <Fireworks />
      <ScrollToTop />
      <main className="relative z-40 flex flex-1 flex-col pt-20 sm:pt-24">
        <AnimatePresence mode="wait" initial={false}>
          <RouteTransition key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/team" element={<Team />} />
              <Route path="/past-seasons" element={<PastSeasons />} />
              <Route path="/sponsorships" element={<Sponsorships />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/branding" element={<Branding />} />
            </Routes>
          </RouteTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default App;
