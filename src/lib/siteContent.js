import defaultSiteContent from '../data/defaultSiteContent.js';

const FIRESTORE_ARRAY_MARKER = '__sf_firestore_array__';
const sponsorLogoByName = {
  'Art of Problem Solving': 'sponsorships/AOPS.png',
  'CNC Madness': 'sponsorships/CNC Madness.png',
  'Gene Haas Foundation': 'sponsorships/HAAS.png',
  Misumi: 'sponsorships/Misumi.png',
  'Pantry Shelf': 'sponsorships/pantry.png',
  Polymaker: 'sponsorships/polymaker.png',
  'White Plains Hospital': 'sponsorships/WhitePlainsHospital.png',
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

const normalizeSponsorLogos = (content) => {
  if (!Array.isArray(content?.sponsors)) {
    return content;
  }

  return {
    ...content,
    sponsors: content.sponsors.map((sponsor) => {
      const mappedLogo = sponsorLogoByName[sponsor?.name];

      if (!mappedLogo) {
        return sponsor;
      }

      return {
        ...sponsor,
        logo: mappedLogo,
      };
    }),
  };
};

export const resolveSiteContent = (remoteContent) =>
  normalizeSponsorLogos(mergeSiteContent(defaultSiteContent, remoteContent));

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
