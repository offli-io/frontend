import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeUserSettings } from 'api/settings/requests';
import { AuthenticationContext } from 'context/providers/authentication-provider';
import { USER_SETTINGS_QUERY_KEY } from 'hooks/use-user-settings';
import React from 'react';
import { toast } from 'sonner';
import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';
import { setThemeToStorage } from 'utils/storage.util';

export const useToggleTheme = () => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();

  const { mutate: sendToggleTheme, isLoading: isTogglingTheme } = useMutation(
    ['send-buddy-request'],
    (theme?: ThemeOptionsEnumDto) => changeUserSettings(userInfo?.id, { theme }),
    {
      onSuccess: (_, theme) => {
        toast.success('Your theme has been changed successfully');
        queryClient.invalidateQueries([USER_SETTINGS_QUERY_KEY]);
        setThemeToStorage(theme);
        (window as any).ReactNativeWebView.postMessage(theme);
      },
      onError: () => {
        toast.error('Failed to toggle theme');
      }
    }
  );

  const handleToggleTheme = React.useCallback(
    (theme?: ThemeOptionsEnumDto) => {
      sendToggleTheme(theme);
    },
    [sendToggleTheme]
  );

  return { handleToggleTheme, isTogglingTheme };
};
