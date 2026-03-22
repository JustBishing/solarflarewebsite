# Solar Flare Robotics Website

A Vite-powered React site for Solar Flare Robotics (FTC Team #25707). The site combines React Router, Tailwind CSS, and Framer Motion to deliver animated, accessible pages for Home, Team, and Sponsorships.

## Tech stack

- [Vite](https://vite.dev/) + React (JavaScript)
- [React Router](https://reactrouter.com/) for routing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animation with reduced-motion fallback

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

The public site now reads from a single site-content object. You can still edit the built-in defaults in [src/data/defaultSiteContent.js](/Users/rishi/Desktop/Projects/solarflarewebsite/src/data/defaultSiteContent.js), or enable the live admin editor below.

## Admin mode

`/admin` uses Firebase Authentication for Google sign-in and Firestore for persistent live content updates.

1. Copy [.env.example](/Users/rishi/Desktop/Projects/solarflarewebsite/.env.example) to `.env.local`.
2. Fill in your Firebase web-app config values.
3. Set `VITE_ADMIN_AUTHORIZED_EMAILS` to the exact Google emails, or `@domain.com` suffixes, allowed to edit the site.
4. Enable Google as a sign-in provider in Firebase Authentication.
5. Create a Firestore database. The app writes the live document to `siteContent/current`.
6. Publish Firestore rules that mirror your allowed admin emails or domains. A starter example lives in [firestore.rules.example](/Users/rishi/Desktop/Projects/solarflarewebsite/firestore.rules.example).

If Firebase is not configured, the public site falls back to the built-in defaults and `/admin` shows setup guidance instead of allowing sign-in or saving.

## Weekly backup

The repo includes a scheduled GitHub Action that exports `siteContent/current` from Firestore into [backups/siteContent.current.json](/Users/rishi/Desktop/Projects/solarflarewebsite/backups/siteContent.current.json) once a week and commits the change back to `main`.

To enable it:

1. Create a Firebase service account with Firestore read access.
2. Add the full JSON credentials as a GitHub Actions secret named `FIREBASE_SERVICE_ACCOUNT`.
3. Enable the workflow in the `Actions` tab. It also supports manual runs.

## Accessibility & motion

- Headings follow a semantic structure, focus states are visible, and navigation uses `aria-current="page"`.
- Animations respect the user’s reduced-motion preference via Framer Motion’s `useReducedMotion`. When `prefers-reduced-motion: reduce` is set, motion falls back to opacity-only transitions.

## Attribution

Content and data were paraphrased from:

- https://solarflarerobotics.org
- https://solarflarerobotics.org/team
- https://solarflarerobotics.org/sponsorships

All sponsor names and contributions reflect the latest information from the source pages.
