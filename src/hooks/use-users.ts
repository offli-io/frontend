import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { IUsersSearchParamsDto } from 'types/users/users-search-params.dto';
import { getUsers } from '../api/activities/requests';

export interface IUseUsersParams {
  params?: IUsersSearchParamsDto;
  queryOptions?: UseQueryOptions;
}

export const PAGED_USERS_QUERY_KEY = 'paged-users';

export const useUsers = ({
  params: { username, ...restParams } = {},
  queryOptions
}: IUseUsersParams) => {
  const { data: { data: { users = [], buddie_states = [] } = {} } = {}, isFetching } = useQuery(
    ['users', username],
    () => getUsers({ username, ...restParams }),
    {
      onError: () => {
        //some generic toast for every hook
        toast.error('Failed to load users');
      },
      enabled: queryOptions?.enabled
    }
  );

  return { users, buddieStates: buddie_states, isLoading: isFetching };
};
