import defaultSiteContent from '../data/defaultSiteContent.js';

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

export { defaultSiteContent };
