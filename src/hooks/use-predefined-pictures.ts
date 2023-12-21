import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getPredefinedPhotos } from '../api/activities/requests';

export interface IUsePredefinedPicturesReturn {
  tags?: string[];
}

export const usePredefinedPictures = ({ tags }: IUsePredefinedPicturesReturn = {}) => {
  const { data, isLoading } = useQuery(
    ['predefined-photos', tags],
    () => getPredefinedPhotos(tags),
    {
      onError: () => {
        toast.error('Failed to load predefined pictures');
      }
    }
  );

  return { data, isLoading };
};
