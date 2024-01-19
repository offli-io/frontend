import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getFeedbackAlreadySentByUser } from '../api/users/requests';

interface IUseFeedbackAlreadySentByUserReturn {
  userId?: number;
  activityId?: number;
  enabled?: boolean;
}
export const useFeedbackAlreadySentByUser = ({
  userId,
  activityId,
  enabled
}: IUseFeedbackAlreadySentByUserReturn) => {
  const { data, isLoading } = useQuery(
    ['userAlreadySentFeedback', userId, activityId],
    () => getFeedbackAlreadySentByUser(userId, activityId),
    {
      enabled: enabled,
      onError: () => {
        toast.error('Failed to load user feedback data');
      }
    }
  );

  return { data, isLoading };
};
