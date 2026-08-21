/**
 * Refreshes public/siteContent.json from the live document.
 *
 * That file is the fallback the site renders when the live read fails, so it
 * is only useful if it is close to current — a stale one silently serves old
 * copy during an outage, which is worse than it sounds because nothing looks
 * broken.
 *
 * Unlike scripts/export-firestore-content.mjs this needs no service account:
 * the document is world-readable, so it goes over the same REST endpoint the
 * site itself uses. Reads the project id and API key from the environment or
 * from .env.local.
 *
 *   node scripts/snapshot-site-content.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const readEnvFile = async () => {
  try {
    const raw = await readFile(join(root, '.env.local'), 'utf8');
    return Object.fromEntries(
      raw
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => {
          const eq = line.indexOf('=');
          return [line.slice(0, eq), line.slice(eq + 1).replace(/^["']|["']$/g, '')];
        }),
    );
  } catch {
    return {};
  }
};

const decodeValue = (value) => {
  if (!value || typeof value !== 'object') return undefined;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) return (value.arrayValue?.values ?? []).map(decodeValue);
  if ('mapValue' in value) return decodeFields(value.mapValue?.fields);
  return undefined;
};

const decodeFields = (fields) =>
  Object.fromEntries(
    Object.entries(fields ?? {}).map(([key, value]) => [key, decodeValue(value)]),
  );

const migrateAssetPaths = (node) => {
  if (Array.isArray(node)) {
    node.forEach(migrateAssetPaths);
    return;
  }
  if (!node || typeof node !== 'object') return;

  Object.entries(node).forEach(([key, value]) => {
    if (typeof value === 'string') {
      node[key] = value.replace(
        /^(\/?(?:members|sponsorships)\/[^?#]+)\.png$/i,
        '$1.webp',
      );
      return;
    }
    migrateAssetPaths(value);
  });
};

const main = async () => {
  const env = { ...(await readEnvFile()), ...process.env };
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = env.VITE_FIREBASE_API_KEY;

  if (!projectId || !apiKey) {
    console.error('Missing VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_API_KEY.');
    process.exit(1);
  }

  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}`
    + `/databases/(default)/documents/siteContent/current?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Live read failed (${response.status}). Nothing written.`);
    process.exit(1);
  }

  const { decodeSiteContentFromFirestore } = await import('../src/lib/siteContent.js');
  const content = decodeSiteContentFromFirestore(decodeFields((await response.json()).fields));

  // Stored asset paths still point at the pre-optimisation PNGs. The app has a
  // shim that rewrites those at runtime, but the snapshot should not depend on
  // it — write the paths that actually exist on disk.
  migrateAssetPaths(content);

  const target = join(root, 'public', 'siteContent.json');
  await writeFile(target, `${JSON.stringify(content, null, 2)}\n`);
  console.log(`Wrote ${target} (${Object.keys(content).length} top-level sections).`);
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
