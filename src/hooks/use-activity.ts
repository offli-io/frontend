import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { IActivity } from 'types/activities/activity.dto';
import { getActivity, getActivityAnonymous } from '../api/activities/requests';
import { AuthenticationContext } from 'context/providers/authentication-provider';

export const ACTIVITY_QUERY_KEY = 'activity';

export interface IUseActivitiesReturn {
  id: number;
  //   onSuccess?: (data?: AxiosResponse<T>) => void;
  enabled?: boolean;
}

export const useActivity = ({ id, enabled }: IUseActivitiesReturn) => {
  const { userInfo: { id: userId = null } = {} } = React.useContext(AuthenticationContext);
  return useQuery(
    [ACTIVITY_QUERY_KEY, id],
    () =>
      userId
        ? getActivity<IActivity>({
            id
          })
        : getActivityAnonymous<IActivity>({
            id
          }),
    {
      //  onSuccess,
      onError: () => {
        toast.error(`Failed to load activity'}`);
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      enabled: !!id || enabled
    }
  );
};
