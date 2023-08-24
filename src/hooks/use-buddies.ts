import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getBuddies } from "../api/activities/requests";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import { AxiosResponse } from "axios";
import { IPerson } from "../types/activities/activity.dto";

export interface IUseBuddiesProps {
  text?: string;
  select?: (
    data: AxiosResponse<IPerson[], any>
  ) => AxiosResponse<IPerson[], any>;
}

export const useBuddies = ({ text, select }: IUseBuddiesProps = {}) => {
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
      select,
    }
  );

  return { data, isLoading, invalidateBuddies };
};
