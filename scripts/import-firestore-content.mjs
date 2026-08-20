/**
 * Applies a JSON content patch to siteContent/current.
 *
 * The site's content lives in Firestore, so editing the repo defaults does not
 * change what visitors see. This is the counterpart to
 * export-firestore-content.mjs: a reviewable, diffable way to change live copy
 * without hand-editing it through the admin UI.
 *
 *   node scripts/import-firestore-content.mjs content/sponsorship-tiers.json
 *   node scripts/import-firestore-content.mjs <file> --apply
 *
 * Dry-run is the default and prints a field-level diff. Nothing is written
 * without --apply.
 *
 * Requires FIREBASE_SERVICE_ACCOUNT (the full service-account JSON), which
 * lives as a GitHub Actions secret — run this through the update-content
 * workflow rather than pasting the key onto a laptop.
 */

import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const [patchPath, ...flags] = process.argv.slice(2);
const apply = flags.includes('--apply');

if (!patchPath) {
  throw new Error('Usage: import-firestore-content.mjs <patch.json> [--apply]');
}

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountJson) {
  throw new Error(
    'FIREBASE_SERVICE_ACCOUNT is required. Set it to the full Firebase service account JSON.',
  );
}

const file = JSON.parse(await readFile(patchPath, 'utf8'));
const patch = file.patch;

if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
  throw new Error(`${patchPath} must contain a top-level object under "patch".`);
}

if (!getApps().length) {
  initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
}

const db = getFirestore();
const ref = db.collection('siteContent').doc('current');
const before = await ref.get();

if (!before.exists) {
  throw new Error('siteContent/current does not exist — refusing to create it from a patch.');
}

const current = before.data();

/** Leaf-level diff, so an array swap reads as one change rather than a blob. */
const diff = (a, b, path = []) => {
  const here = path.join('.');

  if (JSON.stringify(a) === JSON.stringify(b)) return [];

  const isObj = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v);

  if (isObj(a) && isObj(b)) {
    return Object.keys(b).flatMap((key) => diff(a?.[key], b[key], [...path, key]));
  }

  return [{ path: here, from: a, to: b }];
};

const changes = diff(current, patch);

if (!changes.length) {
  console.log('No changes — live content already matches the patch.');
  process.exit(0);
}

console.log(`\n${changes.length} field(s) would change in siteContent/current:\n`);

for (const change of changes) {
  console.log(`  ${change.path}`);
  console.log(`    - ${JSON.stringify(change.from)}`);
  console.log(`    + ${JSON.stringify(change.to)}\n`);
}

if (!apply) {
  console.log('Dry run. Re-run with --apply to write these changes.');
  process.exit(0);
}

// merge:true so untouched sections survive; a patched array replaces wholesale,
// which is what we want for a rewritten benefits list.
await ref.set(patch, { merge: true });
console.log(`Applied ${changes.length} change(s) to siteContent/current.`);
