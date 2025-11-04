import { Link } from 'react-router-dom';

const Footer = () => {
  const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;

  return (
    <footer className="bg-sf-elevated text-sf-text">
      <div className="container grid gap-10 py-12 sm:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex items-center gap-3 text-lg font-semibold">
            <img
              src={logoSrc}
              alt="Solar Flare Robotics logo"
              className="h-10 w-auto"
              loading="lazy"
            />
            <span>Solar Flare Robotics</span>
          </div>
          <p className="mt-4 max-w-xl text-sm text-sf-muted">
            FTC Team #25707 – Solar Flare Robotics, proudly representing the NY-Excelsior region.
            Fiscally sponsored by Hack Club (501(c)(3)), making every donation tax-deductible.
          </p>
          <p className="mt-6 text-sm text-sf-muted/80">
            Fiscally sponsored by Hack Club (501(c)(3)).
          </p>
        </div>
        <div className="grid gap-6 text-sm">
          <div>
            <h3 className="text-base font-semibold text-sf-text">Get in touch</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="mailto:team@solarflarerobotics.org"
                  className="transition hover:text-sf-orange-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                >
                  team@solarflarerobotics.org
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/solarflarerobotics"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-sf-orange-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@solarflarerobotics"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-sf-orange-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-sf-text">Quick links</h3>
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
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-sf-border py-6">
        <div className="container text-center text-xs text-sf-muted">
          © {new Date().getFullYear()} Solar Flare Robotics. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
