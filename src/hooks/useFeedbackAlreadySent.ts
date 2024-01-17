import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getUserAlreadySendFeedback } from '../api/users/requests';

export const useFeedbackAlreadySent = (userId?: number, activityId?: number) => {
  const { data, isLoading } = useQuery(
    ['userAlreadySentFeedback', userId, activityId],
    () => getUserAlreadySendFeedback(userId, activityId),
    {
      enabled: !!userId,
      onError: () => {
        toast.error('Failed to load user feedback data');
      }
    }
  );

  return { data, isLoading };
};
