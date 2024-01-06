import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeUserSettings } from 'api/settings/requests';
import { USER_SETTINGS_QUERY_KEY } from 'hooks/use-user-settings';
import React from 'react';
import { toast } from 'sonner';
import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';
import { AuthenticationContext } from '../../../assets/theme/authentication-provider';

export const useToggleTheme = () => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();

  const { mutate: sendToggleTheme, isLoading: isTogglingTheme } = useMutation(
    ['send-buddy-request'],
    (theme?: ThemeOptionsEnumDto) => changeUserSettings(userInfo?.id, { theme }),
    {
      onSuccess: () => {
        toast.success('Your theme has been changed successfully');
        queryClient.invalidateQueries([USER_SETTINGS_QUERY_KEY]);
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
