import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getParticipantActivities } from "../api/activities/requests";
import { getNotifications } from "../api/notifications/requests";

export const PARTICIPANT_ACTIVITIES_QUERY_KEY = "participant-activities";

export const useParticipantActivities = ({
  userId,
}: { userId?: string } = {}) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery(
    [PARTICIPANT_ACTIVITIES_QUERY_KEY, userId],
    () => getParticipantActivities({ userId }),
    {
      onError: () => {
        //some generic toast for every hook
        enqueueSnackbar(`Failed to load participant activities`, {
          variant: "error",
        });
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: [PARTICIPANT_ACTIVITIES_QUERY_KEY],
    });

  return { data, isLoading, invalidate };
};
