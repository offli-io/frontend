import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getBuddies } from "../api/activities/requests";
import { AuthenticationContext } from "../assets/theme/authentication-provider";

export const useBuddies = ({ text }: { text?: string } = {}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();

  const invalidateBuddies = () => queryClient.invalidateQueries(["buddies"]);

  const { data, isLoading } = useQuery(
    ["buddies", userInfo?.id, text],
    () => getBuddies(Number(userInfo?.id), text),
    {
      onError: () => {
        //some generic toast for every hook
        enqueueSnackbar(`Failed to load buddies`, {
          variant: "error",
        });
      },
      enabled: !!userInfo?.id,
    }
  );

  return { data, isLoading, invalidateBuddies };
};
