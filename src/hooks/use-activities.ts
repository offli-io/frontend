import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { IActivitiesParamsDto } from 'types/activities/activities-params.dto';
import { getActivity, getActivityAnonymous } from '../api/activities/requests';
import { AuthenticationContext } from 'assets/theme/authentication-provider';
import React from 'react';

export const ACTIVITIES_QUERY_KEY = 'activities';

export interface IUseActivitiesReturn<T> {
  params?: IActivitiesParamsDto;
  onSuccess?: (data?: AxiosResponse<T>) => void;
  enabled?: boolean;
}

export const useActivities = <T>({
  params: {
    id,
    text,
    tag,
    datetimeFrom,
    datetimeUntil,
    limit,
    offset,
    lon,
    lat,
    participantId,
    participantStatus,
    sort
  } = {},
  onSuccess,
  enabled
}: IUseActivitiesReturn<T>) => {
  const { userInfo: { id: userId = null } = {} } = React.useContext(AuthenticationContext);
  const { data, isLoading, isFetching } = useQuery(
    [
      ACTIVITIES_QUERY_KEY,
      id,
      text,
      tag,
      datetimeFrom,
      datetimeUntil,
      limit,
      offset,
      lat,
      lon,
      participantId,
      participantStatus,
      sort
    ],
    () =>
      userId
        ? getActivity<T>({
            id,
            text: !!text && text?.length > 0 ? text : undefined,
            tag,
            datetimeUntil,
            datetimeFrom,
            limit,
            offset,
            lon,
            lat,
            participantId,
            participantStatus,
            sort
          })
        : getActivityAnonymous<T>({
            id,
            text: !!text && text?.length > 0 ? text : undefined,
            tag,
            datetimeUntil,
            datetimeFrom,
            limit,
            offset,
            lon,
            lat,
            participantId,
            participantStatus,
            sort
          }),
    {
      onSuccess,
      onError: () => {
        toast.error(`Failed to load activit${id ? 'y' : 'ies'}`);
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      enabled
    }
  );

  return { data, isLoading, isFetching, onSuccess };
};
