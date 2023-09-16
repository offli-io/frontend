import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getUsers } from "../api/activities/requests";
import { getNotifications } from "../api/notifications/requests";
import { IUsersSearchParamsDto } from "types/users/users-search-params.dto";

export interface IUseUsersParams {
  params?: IUsersSearchParamsDto;
}

export const useUsers = ({
  params: { username, ...restParams } = {},
}: IUseUsersParams) => {
  const { enqueueSnackbar } = useSnackbar();
  console.log(restParams);
  const { data: { data: { users = [] } = {} } = {}, isLoading } = useQuery(
    ["users", username],
    () => getUsers({ username, ...restParams }),
    {
      onError: () => {
        //some generic toast for every hook
        enqueueSnackbar("Failed to load users", { variant: "error" });
      },
      // enabled: !!username,
    }
  );

  return { users, isLoading };
};
