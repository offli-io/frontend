import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getActivitiesPromiseResolved,
  getActivitiesPromiseResolvedAnonymous
} from 'api/activities/requests';
import { LocationContext } from 'app/providers/location-provider';
import { AuthenticationContext } from 'assets/theme/authentication-provider';
import React from 'react';
import { IActivitiesParamsDto } from 'types/activities/activities-params.dto';
import { ActivitySortColumnEnum } from 'types/activities/activity-sort-enum.dto';
import { ACTIVITES_LIMIT } from 'utils/common-constants';

export const PAGED_ACTIVITIES_QUERY_KEY = 'paged-activities';

export interface IUseActivitiesInfiniteQueryReturn {
  params?: IActivitiesParamsDto;
  enabled?: boolean;
}

export const useActivitiesInfiniteQuery = () =>
  //   {
  //   TODO use params
  //    params,
  // }: IUseActivitiesInfiniteQueryReturn = {}
  {
    const { userInfo } = React.useContext(AuthenticationContext);
    const { location } = React.useContext(LocationContext);

    const {
      data: paginatedActivitiesData,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage
    } = useInfiniteQuery(
      [PAGED_ACTIVITIES_QUERY_KEY, location],
      ({ pageParam = 0 }) =>
        userInfo?.id
          ? getActivitiesPromiseResolved({
              offset: pageParam,
              limit: ACTIVITES_LIMIT,
              lon: location?.coordinates?.lon,
              lat: location?.coordinates?.lat,
              participantId: Number(userInfo?.id),
              sort:
                location?.coordinates?.lon && location?.coordinates?.lat
                  ? ActivitySortColumnEnum.LOCATION
                  : undefined
            })
          : getActivitiesPromiseResolvedAnonymous({
              offset: pageParam,
              limit: ACTIVITES_LIMIT,
              sort:
                location?.coordinates?.lon && location?.coordinates?.lat
                  ? ActivitySortColumnEnum.LOCATION
                  : undefined
            }),
      {
        getNextPageParam: (lastPage, allPages) => {
          // don't need to add +1 because we are indexing offset from 0 (so length will handle + 1)
          if (lastPage?.length === ACTIVITES_LIMIT) {
            const nextPage: number = allPages?.length * ACTIVITES_LIMIT;
            return nextPage;
          }
          return undefined;
        },
        // enabled:
        select: (data) => ({
          pages: data?.pages?.map(
            (page) => page?.filter((activity) => activity?.participant_status === null)
          ),
          pageParams: [...data.pageParams]
        })
      }
    );
    return {
      pages: paginatedActivitiesData?.pages,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage
    };
  };
