import { useQuery } from '@tanstack/react-query';
import { getGoogleClientID } from 'api/google/requests';
import { toast } from 'sonner';

export const GOOGLE_CLIENT_ID_QUERY_KEY = 'google-client-id';

export const useGoogleClientID = () => {
  return useQuery([GOOGLE_CLIENT_ID_QUERY_KEY], () => getGoogleClientID(), {
    onError: () => {
      toast.error('Failed to get google client ID');
    }
  });
};
