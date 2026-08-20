import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { scaleTap, useShouldReduceMotion } from '../lib/motion.js';
import useScrollLock from '../lib/useScrollLock.js';
import { useSiteContent } from '../context/useSiteContent.js';
import { resolveSiteAssetUrl } from '../lib/assets.js';

const navItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Team', to: '/team' },
  { label: 'Past Seasons', to: '/past-seasons' },
  { label: 'Sponsorships', to: '/sponsorships' },
];

const FOCUSABLE = 'a[href], button:not([disabled])';

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-2';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useShouldReduceMotion();
  const {
    siteContent: { branding, sponsorships },
  } = useSiteContent();
  const { scrollY } = useScroll();
  const location = useLocation();
  const logoSrc = resolveSiteAssetUrl(branding.logoSrc, 'logo.png');
  const donateLink = sponsorships?.intro?.primaryCtaLink;
  const donateLabel = sponsorships?.intro?.primaryCtaLabel || 'Sponsor us';

  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 8);
  });

  useScrollLock(isMenuOpen);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  // The panel used to have no keyboard handling at all: Escape did nothing, so
  // the scroll lock stayed on with no way out but hitting the 40px toggle
  // again, and Tab walked straight out of the open panel into the page behind.
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector(FOCUSABLE)?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen, closeMenu]);

  const headerAnimate = useMemo(() => {
    if (scrolled) {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        boxShadow: '0 20px 40px -32px rgba(0,0,0,0.85), 0 1px 0 0 rgba(234,80,32,0.25)',
        backdropFilter: 'blur(14px)',
      };
    }
    return {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      boxShadow: '0 0 0 rgba(0,0,0,0)',
      backdropFilter: 'blur(6px)',
    };
  }, [scrolled]);

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
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link
          to="/"
          className={`group flex min-w-0 items-center gap-3 rounded-xl text-lg font-semibold text-sf-text ${focusRing}`}
        >
          <img
            src={logoSrc}
            alt={branding.logoAlt}
            width="40"
            height="40"
            className="h-10 w-auto shrink-0 drop-shadow-[0_0_14px_rgba(248,146,33,0.35)] transition-transform group-hover:scale-105"
          />
          {/* Previously hidden below sm, which left a phone showing a sun glyph
              and a hamburger and never naming the team. */}
          <span className="heading-display truncate text-sm font-bold uppercase tracking-tight sm:text-base">
            {branding.siteName}
          </span>
        </Link>
        <nav className="hidden items-center gap-2 sm:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `label-mono rounded-full px-4 py-2 transition ${focusRing} ${
                  isActive
                    ? 'text-sf-orange-2'
                    : 'text-sf-muted/70 hover:text-sf-text'
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative inline-flex flex-col items-center">
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-px w-full bg-gradient-to-r from-sf-orange-1 to-sf-orange-2 shadow-[0_0_12px_rgba(255,145,77,0.6)] transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <MotionButton
          ref={toggleRef}
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sf-border bg-sf-surface text-sf-text shadow-sm transition hover:border-sf-orange-1 sm:hidden ${focusRing}`}
          onClick={() => (isMenuOpen ? closeMenu() : setIsMenuOpen(true))}
          whileTap={scaleTap}
        >
          <svg
            aria-hidden="true"
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
      {/*
        Portalled to <body>: this header carries a backdrop-filter, which makes
        it a containing block for fixed-position descendants, so a scrim
        rendered inside it covers the 80px header rather than the viewport.

        Always mounted and toggled with CSS rather than AnimatePresence. An
        exiting node here lingers in the DOM after its opacity animation
        finishes, and a full-viewport invisible element that still accepts
        pointer events swallows every click on the page. pointer-events-none
        when closed makes that impossible regardless of unmount timing.

        aria-hidden with no tab stop is deliberate: Escape and the toggle are
        the keyboard paths, and this is a redundant pointer convenience.
      */}
      {createPortal(
        <div
          aria-hidden="true"
          onClick={closeMenu}
          className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm sm:hidden ${
            shouldReduceMotion ? '' : 'transition-opacity duration-200'
          } ${isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        />,
        document.body,
      )}
      <AnimatePresence>
        {isMenuOpen ? (
          <motion.nav
            key="mobile-nav"
            id="mobile-nav"
            ref={panelRef}
            className="relative overflow-hidden sm:hidden"
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
              <div className="flex flex-col gap-2 rounded-2xl border border-sf-border bg-sf-elevated p-4 shadow-[0_28px_44px_-32px_rgba(0,0,0,0.7)]">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sf-orange-1 ${
                        isActive
                          ? 'bg-sf-orange-1/20 text-sf-orange-1'
                          : 'text-sf-muted hover:bg-white/5 hover:text-sf-text'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                {donateLink ? (
                  <a
                    href={donateLink}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-1 rounded-xl bg-sf-orange-1 px-4 py-3 text-center text-base font-semibold text-sf-bg transition hover:bg-sf-orange-2 ${focusRing}`}
                  >
                    {donateLabel}
                  </a>
                ) : null}
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
