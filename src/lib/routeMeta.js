/**
 * Per-route metadata, shared by the running app and the build-time prerender.
 *
 * GitHub Pages has no server, so the only way a crawler or a link unfurler
 * sees a real title on /sponsorships is if a static file exists at that path
 * with the tags already in it. scripts/prerender.mjs writes those files from
 * this table; usePageMeta keeps the tags correct during client-side nav.
 * Both read this one source so the two can't drift.
 */

export const SITE_URL = 'https://www.solarflarerobotics.org';
export const SITE_NAME = 'Solar Flare Robotics';
export const OG_IMAGE_PATH = '/og-cover.jpg';

export const routeMeta = [
  {
    path: '/',
    title: 'Solar Flare Robotics — FIRST Tech Challenge Team 25707',
    description:
      'Solar Flare is FIRST Tech Challenge team 25707 out of Edgemont Jr./Sr. High School in New York — a World Championship qualifier with the #1 OPR in the state.',
  },
  {
    path: '/team',
    title: 'Our Team — Solar Flare Robotics',
    description:
      'Meet the students who design, build, and drive FTC team 25707, and find out how to join Solar Flare Robotics.',
  },
  {
    path: '/past-seasons',
    title: 'Past Seasons — Solar Flare Robotics',
    description:
      'Competition results, awards, and hardware milestones from every Solar Flare Robotics season, including our run to the FIRST World Championship.',
  },
  {
    path: '/sponsorships',
    title: 'Sponsor Us — Solar Flare Robotics',
    description:
      'Back FTC team 25707. Sponsorship tiers from $250 to $2,500+, and every donation is tax-deductible through our Hack Club 501(c)(3) fiscal sponsorship.',
  },
  // Internal tooling: prerendered so the URL resolves, but kept out of search.
  {
    path: '/branding',
    title: 'Brand System — Solar Flare Robotics',
    description: 'Internal brand and design token reference for Solar Flare Robotics.',
    noindex: true,
  },
  {
    path: '/admin',
    title: 'Content Admin — Solar Flare Robotics',
    description: 'Content administration for Solar Flare Robotics.',
    noindex: true,
  },
];

const FALLBACK = routeMeta[0];

/** Route metadata for a pathname, tolerating a trailing slash. */
export const metaForPath = (pathname) => {
  const normalized =
    pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  return routeMeta.find((entry) => entry.path === normalized) || FALLBACK;
};

/** Routes that belong in sitemap.xml. */
export const indexableRoutes = routeMeta.filter((entry) => !entry.noindex);
