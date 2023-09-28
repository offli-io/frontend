import {
  UseQueryOptions,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getActivity } from "../api/activities/requests";
import { IActivitiesParamsDto } from "types/activities/activities-params.dto";
import { AxiosResponse } from "axios";

export const ACTIVITIES_QUERY_KEY = "activities";
export const PAGED_ACTIVITIES_QUERY_KEY = "paged-activities";

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
    sort,
  } = {},
  onSuccess,
  enabled,
}: IUseActivitiesReturn<T>) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery(
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
      sort,
    ],
    () =>
      getActivity<T>({
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
        sort,
      }),
    {
      onSuccess,
      onError: () => {
        //some generic toast for every hook
        enqueueSnackbar(`Failed to load activit${id ? "y" : "ies"}`, {
          variant: "error",
        });
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      enabled,
    }
  );

  return { data, isLoading, onSuccess };
};
