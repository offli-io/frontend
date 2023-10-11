import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { IUsersParamsDto } from "types/users";
import { getUser } from "../api/activities/requests";

export const useUser = ({ id, requestingInfoUserId }: IUsersParamsDto) => {
  const { data, isLoading, isFetching } = useQuery(
    ["user", id, requestingInfoUserId],
    () => getUser({ id, requestingInfoUserId }),
    {
      onError: () => {
        toast.error("Failed to load user");
      },
      enabled: !!id,
    }
  );

  return { data, isLoading, isFetching };
};
