import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getUser } from "../api/activities/requests";

export const useUser = ({ id }: { id?: number }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery(["user", id], () => getUser({ id }), {
    onError: () => {
      //some generic toast for every hook
      enqueueSnackbar("Failed to load user", { variant: "error" });
    },
    enabled: !!id,
  });

  return { data, isLoading };
};
