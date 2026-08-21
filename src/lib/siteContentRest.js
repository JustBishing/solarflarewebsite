import { firebaseConfig } from './firebase.js';

/**
 * Reading the site content over the Firestore REST API instead of the SDK.
 *
 * The document is world-readable (`allow read: if true`), so a visitor needs
 * nothing but an HTTP GET to see it. Pulling in firebase/app + firebase/firestore
 * to do that cost every visitor ~80KB gzipped — over a third of the page's
 * total JS — for a single read of a single document.
 *
 * The SDK still owns /admin: that route is lazily loaded, and it needs real
 * auth for writes and a live subscription for conflict detection. This module
 * is the public read path only.
 */

const HOST = 'https://firestore.googleapis.com/v1';

export const siteContentUrl = () => {
  const { projectId, apiKey } = firebaseConfig;
  if (!projectId || !apiKey) return null;

  return `${HOST}/projects/${encodeURIComponent(projectId)}/databases/(default)`
    + `/documents/siteContent/current?key=${encodeURIComponent(apiKey)}`;
};

/**
 * One Firestore REST value -> plain JS.
 *
 * Note `integerValue` arrives as a *string* — JSON has no 64-bit integer, so
 * the API sends it quoted and a naive pass-through would put "3" where the
 * app expects 3.
 */
const decodeValue = (value) => {
  if (!value || typeof value !== 'object') return undefined;

  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('nullValue' in value) return null;
  if ('timestampValue' in value) return value.timestampValue;
  if ('bytesValue' in value) return value.bytesValue;
  if ('referenceValue' in value) return value.referenceValue;
  if ('geoPointValue' in value) return value.geoPointValue;

  if ('arrayValue' in value) {
    return (value.arrayValue?.values ?? []).map(decodeValue);
  }

  if ('mapValue' in value) {
    return decodeFields(value.mapValue?.fields);
  }

  // An unrecognised type is dropped rather than passed through raw: the merge
  // in resolveSiteContent then falls back to the bundled default for that key.
  return undefined;
};

const decodeFields = (fields) =>
  Object.fromEntries(
    Object.entries(fields ?? {}).map(([key, value]) => [key, decodeValue(value)]),
  );

/**
 * Fetches the content document. Resolves to the decoded plain object, or
 * throws — the caller decides whether to fall back to bundled defaults.
 */
export const fetchSiteContent = async (signal) => {
  const url = siteContentUrl();
  if (!url) throw new Error('Firestore is not configured.');

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Failed to load content (${response.status})`);
  }

  const document = await response.json();
  return decodeFields(document?.fields);
};
