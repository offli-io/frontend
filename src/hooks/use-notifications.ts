import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getNotifications } from '../api/notifications/requests';

export const useNotifications = (userId?: number) => {
  const { data, isLoading } = useQuery(
    ['notifications', userId],
    () => getNotifications(userId ?? -1),
    {
      enabled: !!userId,
      onError: () => {
        toast.error('Failed to load notifications');
      }
    }
  );

  return { data, isLoading };
};
