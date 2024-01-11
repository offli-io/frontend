import { useQuery } from '@tanstack/react-query';
import { getUserSettings } from 'api/settings/requests';
import { AuthenticationContext } from 'context/providers/authentication-provider';
import React from 'react';
import { toast } from 'sonner';

export const USER_SETTINGS_QUERY_KEY = 'user-settings';

export const useUserSettings = () => {
  const { userInfo } = React.useContext(AuthenticationContext);

  return useQuery([USER_SETTINGS_QUERY_KEY, userInfo?.id], () => getUserSettings(userInfo?.id), {
    onError: () => {
      toast.error('Failed to get user settings');
    }
  });
};
