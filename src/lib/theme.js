export const defaultThemeColors = {
  orange1: '#EA5020',
  orange2: '#F89221',
  bg: '#0B101E',
  surface: '#141A2D',
  elevated: '#1C2339',
  border: '#2A3350',
  text: '#F5F7FF',
  muted: '#C4C8E0',
};

const hexToRgbValue = (hex) => {
  const normalized = hex.replace('#', '').trim();

  if (!/^[\da-fA-F]{6}$/.test(normalized)) {
    return null;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `${red} ${green} ${blue}`;
};

export const applyThemeColors = (themeColors = {}) => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;

  Object.entries(defaultThemeColors).forEach(([key, fallbackHex]) => {
    const rgbValue = hexToRgbValue(themeColors[key] || fallbackHex)
      || hexToRgbValue(fallbackHex);

    root.style.setProperty(`--sf-${key}`, rgbValue);
  });
};
