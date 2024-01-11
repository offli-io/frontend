import { useQuery } from '@tanstack/react-query';
import { AuthenticationContext } from 'context/providers/authentication-provider';
import { AxiosResponse } from 'axios';
import React from 'react';
import { toast } from 'sonner';
import {
  getActivityParticipants,
  getActivityParticipantsAnonymous
} from '../api/activities/requests';

export const ACTIVITY_PARTICIPANTS_QUERY_KEY = 'activity-participants';
export const PAGED_ACTIVITIES_QUERY_KEY = 'paged-activities';

export interface IUseActivityParticipantsReturn {
  params?: { id?: number | string };
  onSuccess?: (data?: AxiosResponse) => void;
  enabled?: boolean;
}

export const useActivityParticipants = ({
  params: { id } = {},
  onSuccess
}: IUseActivityParticipantsReturn) => {
  const { userInfo: { id: userId = null } = {} } = React.useContext(AuthenticationContext);
  const { data, isLoading, isFetching } = useQuery(
    [ACTIVITY_PARTICIPANTS_QUERY_KEY, id],
    () =>
      userId
        ? getActivityParticipants({ activityId: Number(id) })
        : getActivityParticipantsAnonymous({ activityId: Number(id) }),

    {
      onSuccess,
      onError: () => {
        toast.error('Failed to load activity participants');
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      enabled: !!id
    }
  );

  return { data, isLoading, isFetching, onSuccess };
};
