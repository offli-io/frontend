import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getPredefinedTags } from "../api/activities/requests";

export const useTags = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery(
    ["predefined-tags"],
    () => getPredefinedTags(),
    {
      onError: () => {
        //some generic toast for every hook
        enqueueSnackbar("Failed to load tags", { variant: "error" });
      },
    }
  );

  return { data, isLoading };
};
