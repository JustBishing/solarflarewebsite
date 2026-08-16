import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/useSiteContent.js';
import { resolveSiteAssetUrl } from '../lib/assets.js';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Team', to: '/team' },
  { label: 'Sponsorships', to: '/sponsorships' },
  { label: 'Past Seasons', to: '/past-seasons' },
  { label: 'Branding', to: '/branding' },
  { label: 'Admin', to: '/admin' },
];

const linkClass =
  'text-sm text-sf-muted/70 transition hover:text-sf-orange-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40';

const Footer = () => {
  const {
    siteContent: { branding, footer },
  } = useSiteContent();
  const logoSrc = resolveSiteAssetUrl(branding.logoSrc, 'logo.png');

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-sf-bg/70 text-sf-text backdrop-blur-md">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sf-orange-2/70 to-transparent"
      />

      {/* Team number as a base watermark, echoing the hero. */}
      <span
        aria-hidden="true"
        className="heading-hero pointer-events-none absolute -bottom-10 right-4 hidden select-none font-black leading-none text-white/[0.03] lg:block"
        style={{ fontSize: 'clamp(8rem, 14vw, 13rem)' }}
      >
        {branding.teamNumber}
      </span>

      <div className="container relative grid gap-12 py-16 sm:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logoSrc}
              alt={branding.logoAlt}
              className="h-10 w-auto drop-shadow-[0_0_14px_rgba(255,145,77,0.35)]"
              loading="lazy"
            />
            <span className="heading-display text-base font-bold uppercase tracking-tight">
              {branding.siteName}
            </span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-sf-muted/80">
            {footer.description}
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-sf-muted/55">
            {footer.sponsorNote}
          </p>
        </div>

        <div>
          <h3 className="label-mono text-sf-orange-2">{footer.contactTitle}</h3>
          <ul className="mt-4 space-y-3">
            <li>
              <a href={`mailto:${footer.email}`} className={linkClass}>
                {footer.email}
              </a>
            </li>
            {footer.socials.map((social) => (
              <li key={`${social.label}-${social.href}`}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label-mono text-sf-orange-2">
            {footer.quickLinksTitle}
          </h3>
          <ul className="mt-4 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
