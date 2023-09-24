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
}

export const useActivities = <T>({
  params: {
    id,
    text,
    tag,
    datetimeFrom,
    limit,
    offset,
    lon,
    lat,
    participantId,
    sort,
  } = {},
  onSuccess,
}: IUseActivitiesReturn<T>) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery(
    [
      ACTIVITIES_QUERY_KEY,
      id,
      text,
      tag,
      datetimeFrom,
      limit,
      offset,
      lat,
      lon,
      participantId,
      sort,
    ],
    () =>
      getActivity<T>({
        id,
        text: !!text && text?.length > 0 ? text : undefined,
        tag,
        datetimeFrom,
        limit,
        offset,
        lon,
        lat,
        participantId,
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
    }
  );

  return { data, isLoading, onSuccess };
};
