import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getActivity } from "../api/activities/requests";

export const useActivities = <T>({
  id,
  text,
  tag,
  date,
  limit,
  offset,
}: {
  id?: number;
  text?: string;
  tag?: string[];
  date?: Date | null;
  limit?: number;
  offset?: number;
} = {}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery(
    ["activities", id, text, tag, date, limit, offset],
    () => getActivity<T>({ id, text, tag, date, limit, offset }),
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
