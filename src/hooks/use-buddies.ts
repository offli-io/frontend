import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getBuddies } from "../api/activities/requests";
import { AuthenticationContext } from "../assets/theme/authentication-provider";

export const useBuddies = ({ text }: { text?: string } = {}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = React.useContext(AuthenticationContext);

  const { data, isLoading } = useQuery(
    ["buddies", userInfo?.id, text],
    () => getBuddies(String(userInfo?.id), text),
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

  return { data, isLoading };
};
