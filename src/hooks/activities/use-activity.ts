import { useQuery } from '@tanstack/react-query';
import { AuthenticationContext } from 'components/context/providers/authentication-provider';
import React from 'react';
import { toast } from 'sonner';
import { IActivity } from 'types/activities/activity.dto';
import { getActivity, getActivityAnonymous } from '../../api/activities/requests';
import { IBackendResponse } from '../../types/common/backend-response.dto';

export const ACTIVITY_QUERY_KEY = 'activity';

export interface IUseActivitiesReturn {
  id: number;
  //   onSuccess?: (data?: AxiosResponse<T>) => void;
  enabled?: boolean;
}

export interface IUseActivity extends IBackendResponse {
  activity: IActivity;
}

export const useActivity = ({ id, enabled }: IUseActivitiesReturn) => {
  const { userInfo: { id: userId = null } = {} } = React.useContext(AuthenticationContext);
  return useQuery(
    [ACTIVITY_QUERY_KEY, id],
    () =>
      userId
        ? getActivity<IUseActivity>({
            id
          })
        : getActivityAnonymous<IUseActivity>({
            id
          }),
    {
      //  onSuccess,
      onError: () => {
        toast.error('Failed to load activity');
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      enabled: !!id || enabled
    }
  );
};
