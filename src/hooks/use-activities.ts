import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getActivity } from "../api/activities/requests";

export const useActivities = <T>({
  id,
  text,
  tag,
  datetimeFrom,
  limit,
  offset,
  lon,
  lat,
}: {
  id?: number;
  text?: string;
  tag?: string[];
  datetimeFrom?: Date | null;
  limit?: number;
  offset?: number;
  lon?: number;
  lat?: number;
} = {}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery(
    ["activities", id, text, tag, datetimeFrom, limit, offset, lat, lon],
    () =>
      getActivity<T>({ id, text, tag, datetimeFrom, limit, offset, lon, lat }),
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
