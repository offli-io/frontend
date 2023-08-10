import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getActivity } from "../api/activities/requests";
import { AxiosResponse } from "axios";
import { IActivityRestDto } from "../types/activities/activity-rest.dto";
import { IActivityListRestDto } from "../types/activities/activity-list-rest.dto";

export const useActivities = <T>(
  {
    id,
    text,
    tag,
    date,
  }: { id?: number; text?: string; tag?: string[]; date?: Date | null } = {},
  queryOptions?: Omit<UseQueryOptions, "queryKey" | "queryFn" | "initialData">
) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery(
    ["activities", id, text, tag, date],
    () => getActivity<T>({ id, text, tag, date }),
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
      ...(queryOptions as any),
    }
  );

  return { data, isLoading };
};
