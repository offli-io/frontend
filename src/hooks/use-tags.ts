import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getPredefinedTags } from '../api/activities/requests';

export const useTags = () => {
  const { data, isLoading } = useQuery(['predefined-tags'], () => getPredefinedTags(), {
    onError: () => {
      toast.error('Failed to load tags');
    }
  });

  return { data, isLoading };
};
