import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getActivity, getUsers } from "../api/activities/requests";
import { getNotifications } from "../api/notifications/requests";

export const useActivities = <T>({
  id,
  text,
  tag,
}: { id?: string; text?: string; tag?: string[] } = {}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery(
    ["activities", id, text, tag],
    () => getActivity<T>({ id, text, tag }),
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
