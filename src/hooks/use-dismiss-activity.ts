import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateActivity } from "api/activities/requests";
import { PAGED_ACTIVITIES_QUERY_KEY } from "hooks/use-activities";
import { useSnackbar } from "notistack";
import React from "react";
import { PARTICIPANT_ACTIVITIES_QUERY_KEY } from "./use-participant-activities";

interface IUseSendBuddyRequestProps {
  activityId?: number;
  onSuccess?: () => void;
}

export const useDismissActivity = ({
  onSuccess,
}: IUseSendBuddyRequestProps = {}) => {
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const currentDate = React.useMemo(() => new Date(), []);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: sendDismissActivity, isLoading } = useMutation(
    ["dismiss-activity"],
    (activityId?: number) =>
      updateActivity(Number(activityId), { canceled: true }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([PAGED_ACTIVITIES_QUERY_KEY]);
        queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);
        enqueueSnackbar("Activity has been successfully dismissed", {
          variant: "success",
        });
        onSuccess?.();
      },
      onError: () => {
        enqueueSnackbar("Failed to dismiss activity", { variant: "error" });
      },
    }
  );

  return { sendDismissActivity, isLoading };
};
