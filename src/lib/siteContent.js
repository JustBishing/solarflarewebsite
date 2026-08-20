import defaultSiteContent from '../data/defaultSiteContent.js';

const FIRESTORE_ARRAY_MARKER = '__sf_firestore_array__';
const sponsorLogoByName = {
  'Art of Problem Solving': 'sponsorships/AOPS.webp',
  'CNC Madness': 'sponsorships/CNC Madness.webp',
  'Gene Haas Foundation': 'sponsorships/HAAS.webp',
  Misumi: 'sponsorships/Misumi.webp',
  'Pantry Shelf': 'sponsorships/pantry.webp',
  Polymaker: 'sponsorships/polymaker.webp',
  'White Plains Hospital': 'sponsorships/WhitePlainsHospital.webp',
};
const memberPhotoByName = {
  Arick: 'members/Arick.webp',
  'Arick Khanna': 'members/Arick.webp',
  'Arjun Gupta': 'members/Arjun Gupta.webp',
  'Arjun Khanna': 'members/Arjun Khanna.webp',
  Dani: 'members/Dani.webp',
  'Dani Nayal': 'members/Dani.webp',
  Rishi: 'members/Rishi.webp',
  Ryan: 'members/Ryan.webp',
  'Ryan Ma': 'members/Ryan.webp',
  Tristan: 'members/Tristan.webp',
  'Tristan Li': 'members/Tristan.webp',
};

const isPlainObject = (value) =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const mergeSiteContent = (baseValue, overrideValue) => {
  if (Array.isArray(baseValue)) {
    return Array.isArray(overrideValue) ? overrideValue : baseValue;
  }

  if (!isPlainObject(baseValue)) {
    return overrideValue ?? baseValue;
  }

  const result = { ...baseValue };

  if (!isPlainObject(overrideValue)) {
    return result;
  }

  Object.keys(overrideValue).forEach((key) => {
    result[key] = mergeSiteContent(baseValue[key], overrideValue[key]);
  });

  return result;
};

/**
 * Asset paths: the name maps above are a *fallback*, not an override.
 *
 * They used to be applied unconditionally, which quietly discarded whatever an
 * editor had saved — Admin presented an editable photo/logo field, accepted the
 * change, wrote it to Firestore, and then the site rendered the hardcoded path
 * anyway. The field was decorative. Stored values win now; the map only fills
 * in a blank or a leftover placehold.co URL.
 */
const isUsableAssetPath = (value) =>
  typeof value === 'string' && value.trim() !== '' && !value.includes('placehold.co');

/**
 * Stored content still points at the pre-optimisation PNGs, which no longer
 * exist. Rewrite those known paths to the WebP that replaced them, and leave
 * anything else alone.
 */
const migrateLegacyAssetPath = (value) =>
  typeof value === 'string'
    ? value.replace(/^(\/?(?:members|sponsorships)\/[^?#]+)\.png$/i, '$1.webp')
    : value;

const resolveAssetPath = (stored, fallback) => {
  const migrated = migrateLegacyAssetPath(stored);
  return isUsableAssetPath(migrated) ? migrated : fallback;
};

const normalizeSponsorLogos = (content) => {
  if (!Array.isArray(content?.sponsors)) {
    return content;
  }

  return {
    ...content,
    sponsors: content.sponsors.map((sponsor) => {
      const logo = resolveAssetPath(sponsor?.logo, sponsorLogoByName[sponsor?.name]);

      return logo && logo !== sponsor?.logo ? { ...sponsor, logo } : sponsor;
    }),
  };
};

const normalizeMemberPhotos = (content) => {
  if (!Array.isArray(content?.team?.roster?.members)) {
    return content;
  }

  return {
    ...content,
    team: {
      ...content.team,
      roster: {
        ...content.team.roster,
        members: content.team.roster.members.map((member) => {
          const fallback = memberPhotoByName[member?.name]
            || (member?.name === 'Arjun' ? 'members/Arjun Gupta.webp' : undefined);
          const photo = resolveAssetPath(member?.photo, fallback);

          return photo && photo !== member?.photo ? { ...member, photo } : member;
        }),
      },
    },
  };
};

export const resolveSiteContent = (remoteContent) =>
  normalizeMemberPhotos(
    normalizeSponsorLogos(mergeSiteContent(defaultSiteContent, remoteContent)),
  );

const encodeFirestoreArrays = (value, insideArray = false) => {
  if (Array.isArray(value)) {
    const encodedItems = value.map((item) => encodeFirestoreArrays(item, true));

    if (insideArray) {
      return {
        [FIRESTORE_ARRAY_MARKER]: encodedItems,
      };
    }

    return encodedItems;
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [
        key,
        encodeFirestoreArrays(entryValue, insideArray),
      ]),
    );
  }

  return value;
};

const decodeFirestoreArrays = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => decodeFirestoreArrays(item));
  }

  if (isPlainObject(value)) {
    if (
      Object.keys(value).length === 1
      && Object.prototype.hasOwnProperty.call(value, FIRESTORE_ARRAY_MARKER)
      && Array.isArray(value[FIRESTORE_ARRAY_MARKER])
    ) {
      return value[FIRESTORE_ARRAY_MARKER].map((item) =>
        decodeFirestoreArrays(item),
      );
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [
        key,
        decodeFirestoreArrays(entryValue),
      ]),
    );
  }

  return value;
};

export const encodeSiteContentForFirestore = (content) =>
  encodeFirestoreArrays(content);

export const decodeSiteContentFromFirestore = (content) =>
  decodeFirestoreArrays(content);

export { defaultSiteContent };
