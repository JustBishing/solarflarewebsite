# Solar Flare site — working TODO

Tracks the critique fixes (branch `fix/seo-perf-a11y-audit`) and the design/content
work your friend raised. Status: `[x]` done on branch · `[ ]` not started ·
`[?]` needs a decision from you · `[!]` needs you to do it (I can't).

---

## 1. Shipped on this branch — plumbing that costs money

- [x] **Routes return 200, not 404.** `scripts/prerender.mjs` writes a real
      `dist/<route>/index.html` per route. Replaces `cp index.html 404.html`,
      which rendered fine for humans but told every crawler and link unfurler
      the page didn't exist.
- [x] **Per-route metadata.** `src/lib/routeMeta.js` is the single source;
      prerender bakes it in, `usePageMeta` keeps it right on client nav. Title,
      description, canonical, OG, Twitter card, robots.
- [x] **`sitemap.xml` + `robots.txt`** generated at build; `/admin` and
      `/branding` are `noindex`.
- [x] **CI guard** — deploy fails if prerendered routes or their meta are missing.
- [x] **Admin emails out of the bundle.** Was five students' addresses, one
      `curl | grep` away. Now SHA-256 hashed at build (`vite.config.js`).
      Also dropped the `@domain` wildcard that granted the whole domain.
- [x] **Code splitting.** `firebase/auth` moved to `src/lib/firebaseAuth.js`;
      `/admin` and `/branding` are `React.lazy`. Visitors no longer download
      the 1555-line editor or 446KB of auth to read the tier table.
- [x] **Images: 6.2MB → 332KB.** Sponsor logos were 3036px wide rendering at
      122px. Resized + WebP. Old PNGs deleted, paths migrated.
- [x] **Firestore can't hang the site.** 6s timeout falls back to bundled
      defaults instead of "Loading live content…" forever.
- [x] **The CMS stopped lying.** `src/lib/siteContent.js` was overwriting saved
      photo/logo values with hardcoded paths — the Admin fields were decorative.
      Stored values win now; the map is only a fallback.
- [x] **Accessibility**: skip link · Escape + focus trap + scrim on the mobile
      menu · contrast raised on 8 token usages (2.17–3.79:1 → ≥4.5:1) ·
      `HeroGlow` honours `prefers-reduced-motion` and pauses off-screen ·
      footer tap targets 18px → 32px · logo focus ring · team name now visible
      on mobile.
- [x] **Per-tier sponsor CTAs** + donate link in footer and mobile menu.
- [x] **Dead code removed**: `data/team.js`, `data/sponsors.js`,
      `data/achievements.js`, `components/Card.jsx`, `assets/react.svg`,
      `public/vite.svg`, `public/favicon.svg`, tracked `.DS_Store`.
      `firebase-admin` → devDependencies.

## 2. Still open from the critique

- [x] **OG share image** — `/og-cover.jpg`, 1200×630, live.
- [ ] **Admin draft-clobbering.** `Admin.jsx` resets the whole draft on every
      Firestore snapshot, so two people editing at once silently overwrite each
      other. Needs dirty-state tracking + a `beforeunload` guard.
- [x] **`public/siteContent.json`** regenerated from live content — no longer a
      2024-25 snapshot with an ex-member in it.
- [x] **Rajdhani as body face.** Replaced with IBM Plex Sans (400/500/600).
      Rajdhani is gone entirely, so it is also one fewer font request.
- [?] **Upgrade the admin gate properly.** Hashing hides the addresses but
      isn't authorization. Real fix: an `admins/{uid}` Firestore doc, so the
      list lives server-side. Needs a rules change + one doc per admin.
- [?] **The invisible design system.** Angled bands shear 1.31° at 1.05:1
      contrast; ghost wordmarks read as JPEG artifacts over body copy; the
      editorial rail only exists above 1536px. Either commit to these or cut
      them — right now they cost code and deliver nothing.

## 3. Content fixes — DONE, applied to Firestore

Applied via `gh workflow run update-content.yml` (patches in `content/`):

- [x] `"Think Award 1sr Place"` → `1st`
- [x] `"200$ CREDIT"` → `"$200 CREDIT"`
- [x] `"our first season Decode"` → `"our second season"` — Decode is season 2
- [x] Footer no longer prints the Hack Club 501(c)(3) line twice
- [x] Sponsorship tiers rewritten to deliverable benefits
      (`content/sponsorship-tiers.json`)
- [ ] Sponsorship copy still pitches the 2025-26 Decode season, which closed in
      March. Re-point at the upcoming season when you know the dates.
- [?] `content/season-tense.json` — written, NOT applied. Fixes tense only:
      drops `· DECODE` from the hero eyebrow and stops describing a finished
      season in the present tense. Needs your yes before it goes to Firestore.
- [!] `branding.season` is still `"Decode"` and prints in the homepage
      marquee. Re-point once FIRST announces the 2026-27 game.

To change live copy from now on: edit or add a patch under `content/`, then
`gh workflow run update-content.yml -f patch=content/<file>.json -f mode=dry-run`,
check the diff, re-run with `mode=apply`. Every run snapshots the document first
and keeps it as a 90-day artifact.

## 4. Your friend's feedback — design/content, needs decisions

- [x] **"Home page is buns" / "poor representation of our achievements."**
      Record section is now ranked by array order: first result leads at full
      scoreboard scale, next two stack beside it, the rest drop to a footnote
      row. `#75 EPA` no longer shouts as loudly as first pick at Worlds.
      /admin gained Move up / Move down, since position now carries meaning.
- [?] **"No visuals."** True — the only images are 7 logos and 6 portraits.
      No robot, no CAD, no match photos, no video. This is the single biggest
      gap and it needs assets from you, not code.
- [?] **"No outreach/impact page."** New route. Needs an Admin editor and real
      numbers (events, students reached, hours).
- [?] **"Add a why sponsor us section."** Distinct from the tier table: budget,
      where money goes, what a sponsor gets out of it. Needs real figures.
- [?] **"Sponsor section is booty."** Per-tier CTAs done. Amounts now only
      appear on /sponsorships, so the home page wall says who backs us rather
      than for how much; the grid's empty cell no longer reads as a missing
      logo. Still open: logos are not optically balanced — a solid white oval
      next to thin line marks.
- [?] **"Better navigation."** Nav is 4 flat items with no donate action in the
      desktop header. Adding Outreach makes it 5 — worth deciding the shape
      before adding.
- [?] **"Better branding."** Needs scoping — this could mean the palette, the
      logo, the type system, or all three.

## 5. Needs you specifically

- [!] Review this branch, then I'll merge and push (deploy is automatic on `main`).
- [!] Rotate/confirm the `VITE_ADMIN_AUTHORIZED_EMAILS` GitHub secret still
      matches the four real admins — `firestore.rules.example` lists four, the
      old bundle had five (`team@` was extra).
- [!] Confirm production Firestore rules match `firestore.rules.example`.
