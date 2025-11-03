# Solar Flare Robotics Website

A Vite-powered React site for Solar Flare Robotics (FTC Team #25707). The site combines React Router, Tailwind CSS, and Framer Motion to deliver animated, accessible pages for Home, Team, and Sponsorships.

## Tech stack

- [Vite](https://vite.dev/) + React (JavaScript)
- [React Router](https://reactrouter.com/) for routing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animation with reduced-motion fallbacks

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

   The site will be available at the URL printed in the terminal (usually http://localhost:5173).

## Build & preview

To create a production build and run the preview server:

```bash
npm run build
npm run preview
```

## Updating content

- Team members: `src/data/team.js`
- Sponsors: `src/data/sponsors.js`
- Season achievements: `src/data/achievements.js`

Each file exports an array—update, add, or remove entries as needed. Images use placeholder URLs by default; swap them with hosted images when available.

## Accessibility & motion

- Headings follow a semantic structure, focus states are visible, and navigation uses `aria-current="page"`.
- Animations respect the user’s reduced-motion preference via Framer Motion’s `useReducedMotion`. When `prefers-reduced-motion: reduce` is set, motion falls back to opacity-only transitions.

## Attribution

Content and data were paraphrased from:

- https://solarflarerobotics.org
- https://solarflarerobotics.org/team
- https://solarflarerobotics.org/sponsorships

All sponsor names and contributions reflect the latest information from the source pages.
