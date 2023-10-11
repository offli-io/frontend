import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateActivity } from "api/activities/requests";
import { PAGED_ACTIVITIES_QUERY_KEY } from "hooks/use-activities";
import React from "react";
import { toast } from "sonner";
import { PARTICIPANT_ACTIVITIES_QUERY_KEY } from "./use-participant-activities";

interface IUseSendBuddyRequestProps {
  activityId?: number;
  onSuccess?: () => void;
}

export const useDismissActivity = ({
  onSuccess,
}: IUseSendBuddyRequestProps = {}) => {
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  const { mutate: sendDismissActivity, isLoading } = useMutation(
    ["dismiss-activity"],
    (activityId?: number) =>
      updateActivity(Number(activityId), { canceled: true }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([PAGED_ACTIVITIES_QUERY_KEY]);
        queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);
        toast.success("Activity has been successfully dismissed");
        onSuccess?.();
      },
      onError: () => {
        toast.error("Failed to dismiss activity");
      },
    }
  );

  return { sendDismissActivity, isLoading };
};
