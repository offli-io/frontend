import { useInfiniteQuery } from "@tanstack/react-query";
import { IUseActivitiesReturn } from "./use-activities";
import { ACTIVITES_LIMIT } from "utils/common-constants";
import {
  getActivitiesPromiseResolved,
  getActivitiesPromiseResolvedAnonymous,
} from "api/activities/requests";
import { AuthenticationContext } from "assets/theme/authentication-provider";
import { ActivitySortColumnEnum } from "types/activities/activity-sort-enum.dto";
import React from "react";
import { LocationContext } from "app/providers/location-provider";
import { IActivitiesParamsDto } from "types/activities/activities-params.dto";

export const PAGED_ACTIVITIES_QUERY_KEY = "paged-activities";

export interface IUseActivitiesInfiniteQueryReturn {
  params?: IActivitiesParamsDto;
  enabled?: boolean;
}

export const useActivitiesInfiniteQuery = ({
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
    sort,
  } = {},
  enabled,
}: IUseActivitiesInfiniteQueryReturn = {}) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const { location } = React.useContext(LocationContext);

  const {
    data: paginatedActivitiesData,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    [PAGED_ACTIVITIES_QUERY_KEY, location],
    ({ pageParam = 0 }) =>
      !!userInfo?.id
        ? getActivitiesPromiseResolved({
            offset: pageParam,
            limit: ACTIVITES_LIMIT,
            lon: location?.coordinates?.lon,
            lat: location?.coordinates?.lat,
            participantId: Number(userInfo?.id),
            sort:
              location?.coordinates?.lon && location?.coordinates?.lat
                ? ActivitySortColumnEnum.LOCATION
                : undefined,
          })
        : getActivitiesPromiseResolvedAnonymous({
            offset: pageParam,
            limit: ACTIVITES_LIMIT,
            sort:
              location?.coordinates?.lon && location?.coordinates?.lat
                ? ActivitySortColumnEnum.LOCATION
                : undefined,
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
        pages: data?.pages?.map((page) =>
          page?.filter((activity) => activity?.participant_status === null)
        ),
        pageParams: [...data.pageParams],
      }),
    }
  );
  return {
    pages: paginatedActivitiesData?.pages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
