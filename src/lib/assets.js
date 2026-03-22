export const resolveSiteAssetUrl = (value, fallbackValue) => {
  const resolvedValue = value || fallbackValue;

  if (!resolvedValue) {
    return '';
  }

  if (
    resolvedValue.startsWith('http://')
    || resolvedValue.startsWith('https://')
    || resolvedValue.startsWith('data:')
    || resolvedValue.startsWith('/')
  ) {
    return resolvedValue;
  }

  return `${import.meta.env.BASE_URL}${resolvedValue}`;
};
