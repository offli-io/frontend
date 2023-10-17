import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { IUsersParamsDto } from "types/users";
import { getUser } from "../api/activities/requests";
import { AxiosResponse } from "axios";
import { IPersonExtended } from "types/activities/activity.dto";

export const useUser = ({
  id,
  requestingInfoUserId,
  onSuccess,
}: IUsersParamsDto & {
  onSuccess?: (data?: AxiosResponse<IPersonExtended, any>) => void;
}) => {
  const { data, isLoading, isFetching } = useQuery(
    ["user", id, requestingInfoUserId],
    () => getUser({ id, requestingInfoUserId }),
    {
      onError: () => {
        toast.error("Failed to load user");
      },
      enabled: !!id,
      onSuccess,
    }
  );

  return { data, isLoading, isFetching, onSuccess };
};
