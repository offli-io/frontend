import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getFeedbackAlreadySentByUser } from '../api/users/requests';

interface IUseFeedbackAlreadySentByUserReturn {
  userId?: number;
  activityId?: number;
  enabled?: boolean;
}

export const FEEDBACK_ALREADY_SENT_BY_USER_QUERY_KEY = 'userAlreadySentFeedback';

export const useFeedbackAlreadySentByUser = ({
  userId,
  activityId,
  enabled
}: IUseFeedbackAlreadySentByUserReturn) => {
  const { data, isLoading } = useQuery(
    [FEEDBACK_ALREADY_SENT_BY_USER_QUERY_KEY, userId, activityId],
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
