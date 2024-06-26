import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { IPersonExtended } from 'types/activities/activity.dto';
import { IUsersParamsDto } from 'types/users';
import { getUser } from '../../api/activities/requests';

export const USER_QUERY_KEY = 'user';

export const useUser = ({
  id,
  requestingInfoUserId,
  onSuccess
}: IUsersParamsDto & {
  onSuccess?: (data?: AxiosResponse<IPersonExtended, any>) => void;
}) => {
  const { data, isLoading, isFetching } = useQuery(
    [USER_QUERY_KEY, id, requestingInfoUserId],
    () => getUser({ id, requestingInfoUserId }),
    {
      onError: () => {
        toast.error('Failed to load user');
      },
      enabled: !!id,
      onSuccess
    }
  );

  return { data, isLoading, isFetching, onSuccess };
};
