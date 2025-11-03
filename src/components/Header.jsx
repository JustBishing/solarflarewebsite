import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { scaleTap, useShouldReduceMotion } from '../lib/motion.js';
import useScrollLock from '../lib/useScrollLock.js';

const navItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Team', to: '/team' },
  { label: 'Sponsorships', to: '/sponsorships' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useShouldReduceMotion();
  const { scrollY } = useScroll();
  const location = useLocation();
  const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 8);
  });

  useScrollLock(isMenuOpen);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const headerAnimate = useMemo(
    () => ({
      backgroundColor: scrolled ? 'rgba(251, 251, 250, 0.98)' : 'rgba(251, 251, 250, 0)',
      boxShadow: scrolled ? '0 10px 30px -25px rgba(0,0,0,0.35)' : '0 0 0 rgba(0,0,0,0)',
      backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
    }),
    [scrolled],
  );

  const MotionButton = motion.button;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={false}
      animate={headerAnimate}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <div className="container flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-sf-black">
          <img
            src={logoSrc}
            alt="Solar Flare Robotics logo"
            className="h-10 w-auto"
            loading="lazy"
          />
          <span className="hidden sm:inline-block">Solar Flare Robotics</span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-semibold sm:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-1 ${
                  isActive
                    ? 'text-sf-orange-1'
                    : 'text-sf-black hover:text-sf-orange-2'
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative inline-flex flex-col items-center">
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`mt-1 h-0.5 w-8 rounded-full bg-sf-orange-1 transition-all ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <MotionButton
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-sf-black/10 bg-white text-sf-black shadow-sm transition hover:border-sf-orange-1 sm:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          whileTap={scaleTap}
        >
          <span className="sr-only">Toggle navigation menu</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="16" y2="18" />
              </>
            )}
          </svg>
        </MotionButton>
      </div>
      <AnimatePresence>
        {isMenuOpen ? (
          <motion.nav
            id="mobile-nav"
            className="sm:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div className="container pb-4">
              <div className="flex flex-col gap-2 rounded-2xl border border-sf-black/10 bg-white p-4 shadow-[0_24px_36px_-32px_rgba(0,0,0,0.6)]">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-1 ${
                        isActive
                          ? 'bg-sf-orange-1/10 text-sf-orange-1'
                          : 'text-sf-black hover:bg-sf-orange-2/10 hover:text-sf-black'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
