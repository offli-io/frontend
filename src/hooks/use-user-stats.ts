import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getUserStats } from '../api/users/requests';

export const useUserStats = (userId: number) => {
  const { data, isLoading } = useQuery(['feedback', userId], () => getUserStats(userId), {
    enabled: !!userId,
    onError: () => {
      toast.error('Failed to load notifications');
    }
  });

  return { data, isLoading };
};
