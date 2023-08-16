import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getUsers } from "../api/activities/requests";
import { getNotifications } from "../api/notifications/requests";

export const useUsers = ({ username }: { username?: string }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery(
    ["users", username],
    () => getUsers({ username }),
    {
      onError: () => {
        //some generic toast for every hook
        enqueueSnackbar("Failed to load users", { variant: "error" });
      },
      // enabled: !!username,
    }
  );

  return { data, isLoading };
};
