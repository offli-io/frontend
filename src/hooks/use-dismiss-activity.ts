import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateActivity } from 'api/activities/requests';
import { toast } from 'sonner';
import { PAGED_ACTIVITIES_QUERY_KEY } from './use-activities-infinite-query';
import { PARTICIPANT_ACTIVITIES_QUERY_KEY } from './use-participant-activities';
import { ActivityStatusEnumDto } from 'types/activities/activity-status-enum.dto';

interface IUseSendBuddyRequestProps {
  activityId?: number;
  onSuccess?: () => void;
}

export const useDismissActivity = ({ onSuccess }: IUseSendBuddyRequestProps = {}) => {
  const queryClient = useQueryClient();

  const { mutate: sendDismissActivity, isLoading } = useMutation(
    ['dismiss-activity'],
    (activityId?: number) =>
      updateActivity(Number(activityId), { status: ActivityStatusEnumDto.CANCELED }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([PAGED_ACTIVITIES_QUERY_KEY]);
        queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);
        toast.success('Activity has been successfully dismissed');
        onSuccess?.();
      },
      onError: () => {
        toast.error('Failed to dismiss activity');
      }
    }
  );

  return { sendDismissActivity, isLoading };
};
