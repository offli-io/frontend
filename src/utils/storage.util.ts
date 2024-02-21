import { OffliUserAgent } from 'types/common/offli-user-agent-enum.dto';
import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';

export const THEME_STORAGE_KEY = 'theme';
export const PLATFORM_STORAGE_KEY = 'platform';

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

export const setPlatformToStorage = (platform?: OffliUserAgent | null) => {
  if (!platform) {
    localStorage.removeItem(PLATFORM_STORAGE_KEY);
  }
  localStorage.setItem(PLATFORM_STORAGE_KEY, String(platform));
};

export const getPlatfromFromStorage = (): OffliUserAgent | null => {
  const storagePlatform = localStorage.getItem(PLATFORM_STORAGE_KEY);
  return storagePlatform ? (storagePlatform as OffliUserAgent) : null;
};
