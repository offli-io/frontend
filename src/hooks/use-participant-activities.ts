import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { ActivitySortColumnEnum } from "types/activities/activity-sort-enum.dto";
import { getParticipantActivities } from "../api/activities/requests";

export const PARTICIPANT_ACTIVITIES_QUERY_KEY = "participant-activities";

export const useParticipantActivities = ({
  participantId,
  sort,
}: { participantId?: number; sort?: ActivitySortColumnEnum } = {}) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  // const todaysDate = React.useMemo(() => new Date(), []);
  const { data, isLoading } = useQuery(
    [PARTICIPANT_ACTIVITIES_QUERY_KEY, participantId, sort],
    () =>
      getParticipantActivities({
        participantId,
        sort,
        // datetimeFrom: todaysDate,
      }),
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
      enabled: !!participantId,
    }
  );

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: [PARTICIPANT_ACTIVITIES_QUERY_KEY],
    });

  return { data, isLoading, invalidate };
};
