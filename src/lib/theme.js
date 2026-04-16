export const defaultThemeColors = {
  orange1: '#ff914d',
  orange2: '#ffb27a',
  bg: '#000000',
  surface: '#0E0E0E',
  elevated: '#141414',
  border: '#262626',
  text: '#FFFFFF',
  muted: '#C8C8C8',
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

export const applyThemeColors = () => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;

  // Brand palette is locked in code. Firestore theme overrides are ignored
  // so stale saved values can't reintroduce off-brand (e.g. blue) colors.
  Object.entries(defaultThemeColors).forEach(([key, hex]) => {
    root.style.setProperty(`--sf-${key}`, hexToRgbValue(hex));
  });
};
