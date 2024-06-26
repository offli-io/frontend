import { useMutation } from '@tanstack/react-query';
import { updateActivity } from 'api/activities/requests';
import { toast } from 'sonner';
import { ActivityStatusEnumDto } from 'types/activities/activity-status-enum.dto';
import { useInvalidateQueryKeys } from '../utils/use-invalidate-query-keys';

interface IUseSendBuddyRequestProps {
  activityId?: number;
  onSuccess?: () => void;
}

export const useDismissActivity = ({ onSuccess }: IUseSendBuddyRequestProps = {}) => {
  const { activityCreatedOrEditedInvalidation } = useInvalidateQueryKeys();

  const { mutate: sendDismissActivity, isLoading } = useMutation(
    ['dismiss-activity'],
    (activityId?: number) =>
      updateActivity(Number(activityId), { status: ActivityStatusEnumDto.CANCELED }),
    {
      onSuccess: () => {
        activityCreatedOrEditedInvalidation();
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
