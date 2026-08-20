/**
 * Post-build step: give every route a real file so GitHub Pages answers 200.
 *
 * Pages has no server and no rewrite rules. The usual SPA workaround —
 * `cp dist/index.html dist/404.html` — renders the right page for a human but
 * answers with a 404 *status*, which Google, Bing, Slack, Discord and iMessage
 * all read as "this page does not exist". Writing dist/<route>/index.html
 * instead means the URL resolves normally and can carry its own title,
 * description and Open Graph tags.
 *
 * 404.html is still written, for genuinely unknown paths only.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  OG_IMAGE_PATH,
  SITE_URL,
  indexableRoutes,
  routeMeta,
} from '../src/lib/routeMeta.js';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Replaces the head tags the template ships with this route's values. */
const applyMeta = (html, { path, title, description, noindex }) => {
  const canonical = `${SITE_URL}${path}`;
  const t = escape(title);
  const d = escape(description);

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${d}" />`,
    )
    .replace(
      /<meta\s+name="robots"[\s\S]*?\/>/,
      `<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    )
    .replace(
      /<link\s+rel="canonical"[\s\S]*?\/>/,
      `<link rel="canonical" href="${canonical}" />`,
    )
    .replace(
      /<meta\s+property="og:title"[\s\S]*?\/>/,
      `<meta property="og:title" content="${t}" />`,
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${d}" />`,
    )
    .replace(
      /<meta\s+property="og:url"[\s\S]*?\/>/,
      `<meta property="og:url" content="${canonical}" />`,
    )
    .replace(
      /<meta\s+name="twitter:title"[\s\S]*?\/>/,
      `<meta name="twitter:title" content="${t}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"[\s\S]*?\/>/,
      `<meta name="twitter:description" content="${d}" />`,
    );
};

const template = await readFile(join(DIST, 'index.html'), 'utf8');

// Fail loudly rather than shipping a page whose tags silently didn't apply.
for (const marker of ['<title>', 'name="description"', 'rel="canonical"', 'property="og:title"']) {
  if (!template.includes(marker)) {
    throw new Error(`dist/index.html is missing ${marker} — prerender cannot set per-route meta`);
  }
}

const written = [];

for (const route of routeMeta) {
  const html = applyMeta(template, route);
  const target = route.path === '/' ? join(DIST, 'index.html') : join(DIST, route.path, 'index.html');

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html, 'utf8');
  written.push(route.path);
}

// Real 404s: same shell so the SPA still recovers, but never indexed.
await writeFile(
  join(DIST, '404.html'),
  applyMeta(template, {
    path: '/',
    title: 'Page not found — Solar Flare Robotics',
    description: 'That page does not exist. Head back to solarflarerobotics.org.',
    noindex: true,
  }),
  'utf8',
);

await writeFile(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexableRoutes
  .map(
    (route) =>
      `  <url>\n    <loc>${SITE_URL}${route.path}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${route.path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`,
  'utf8',
);

await writeFile(
  join(DIST, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /admin
Disallow: /branding

Sitemap: ${SITE_URL}/sitemap.xml
`,
  'utf8',
);

console.log(
  `prerender: ${written.length} routes (${written.join(', ')}) + 404.html, sitemap.xml, robots.txt`,
);

if (!OG_IMAGE_PATH) {
  console.warn('prerender: no OG image path configured');
}
