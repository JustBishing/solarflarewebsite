import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/useSiteContent.js';
import { resolveSiteAssetUrl } from '../lib/assets.js';

const Footer = () => {
  const {
    siteContent: { branding, footer },
  } = useSiteContent();
  const logoSrc = resolveSiteAssetUrl(branding.logoSrc, 'logo.png');

  return (
    <footer className="bg-sf-elevated text-sf-text">
      <div className="container grid gap-10 py-12 sm:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex items-center gap-3 text-lg font-semibold">
            <img
              src={logoSrc}
              alt={branding.logoAlt}
              className="h-10 w-auto"
              loading="lazy"
            />
            <span>{branding.siteName}</span>
          </div>
          <p className="mt-4 max-w-xl text-sm text-sf-muted">
            {footer.description}
          </p>
          <p className="mt-6 text-sm text-sf-muted/80">
            {footer.sponsorNote}
          </p>
        </div>
        <div className="grid gap-6 text-sm">
          <div>
            <h3 className="text-base font-semibold text-sf-text">{footer.contactTitle}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={`mailto:${footer.email}`}
                  className="transition hover:text-sf-orange-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                >
                  {footer.email}
                </a>
              </li>
              {footer.socials.map((social) => (
                <li key={`${social.label}-${social.href}`}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-sf-orange-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-sf-text">{footer.quickLinksTitle}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  to="/"
                  className="transition hover:text-sf-orange-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  className="transition hover:text-sf-orange-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  to="/sponsorships"
                  className="transition hover:text-sf-orange-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                >
                  Sponsorships
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="transition hover:text-sf-orange-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-sf-border py-6">
        <div className="container text-center text-xs text-sf-muted">
          © {new Date().getFullYear()} {footer.copyrightPrefix}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
