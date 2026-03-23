import defaultSiteContent from '../data/defaultSiteContent.js';

const FIRESTORE_ARRAY_MARKER = '__sf_firestore_array__';

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

export const resolveSiteContent = (remoteContent) =>
  mergeSiteContent(defaultSiteContent, remoteContent);

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
