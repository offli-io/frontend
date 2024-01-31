import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';

export const THEME_STORAGE_KEY = 'theme';

export const setThemeToStorage = (theme?: ThemeOptionsEnumDto | null) => {
  if (!theme) {
    localStorage.removeItem(THEME_STORAGE_KEY);
  }
  localStorage.setItem(THEME_STORAGE_KEY, String(theme));
};

export const getThemeFromStorage = (): ThemeOptionsEnumDto | null => {
  const storageTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return storageTheme ? (storageTheme as ThemeOptionsEnumDto) : null;
};
