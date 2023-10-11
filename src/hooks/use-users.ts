import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { IUsersSearchParamsDto } from "types/users/users-search-params.dto";
import { getUsers } from "../api/activities/requests";
import { toast } from "sonner";

export interface IUseUsersParams {
  params?: IUsersSearchParamsDto;
}

export const PAGED_USERS_QUERY_KEY = "paged-users";

export const useUsers = ({
  params: { username, ...restParams } = {},
}: IUseUsersParams) => {
  const {
    data: { data: { users = [], buddieStates = [] } = {} } = {},
    isLoading,
  } = useQuery(
    ["users", username],
    () => getUsers({ username, ...restParams }),
    {
      onError: () => {
        //some generic toast for every hook
        toast.error("Failed to load users");
      },
      // enabled: !!username,
    }
  );

  return { users, buddieStates, isLoading };
};
