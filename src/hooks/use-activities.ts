import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getActivity } from "../api/activities/requests";
import { IActivitiesParamsDto } from "types/activities/activities-params.dto";

export const ACTIVITIES_QUERY_KEY = "activities";
export const PAGED_ACTIVITIES_QUERY_KEY = "paged-activities";

export const useActivities = <T>({
  id,
  text,
  tag,
  datetimeFrom,
  limit,
  offset,
  lon,
  lat,
  participantId,
}: IActivitiesParamsDto = {}) => {
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
    ],
    () =>
      getActivity<T>({
        id,
        text,
        tag,
        datetimeFrom,
        limit,
        offset,
        lon,
        lat,
        participantId,
      }),
    {
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

  return { data, isLoading };
};
