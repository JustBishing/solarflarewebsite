import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Team from './pages/Team.jsx';
import Sponsorships from './pages/Sponsorships.jsx';
import RouteTransition from './components/RouteTransition.jsx';
import { useShouldReduceMotion } from './lib/motion.js';

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

  return (
    <div className="flex min-h-screen flex-col bg-sf-bg text-sf-black">
      <Header />
      <ScrollToTop />
      <main className="flex flex-1 flex-col pt-20 sm:pt-24">
        <AnimatePresence mode="wait" initial={false}>
          <RouteTransition key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/team" element={<Team />} />
              <Route path="/sponsorships" element={<Sponsorships />} />
            </Routes>
          </RouteTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default App;
