import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getUsers } from "../api/activities/requests";
import { getNotifications } from "../api/notifications/requests";

export const useUsers = ({
  id,
  username,
}: {
  id?: string;
  username?: string;
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery(
    ["users", id, username],
    () => getUsers({ id, username }),
    {
      onError: () => {
        //some generic toast for every hook
        enqueueSnackbar("Failed to load notifications", { variant: "error" });
      },
      enabled: !!id,
    }
  );

  return { data, isLoading };
};
