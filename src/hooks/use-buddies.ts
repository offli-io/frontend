import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import React from 'react';
import { toast } from 'sonner';
import { IBuddiesResponseDto } from 'types/users/buddies-response.dto';
import { getBuddies } from '../api/activities/requests';
import { AuthenticationContext } from '../context/providers/authentication-provider';

export interface IUseBuddiesProps {
  text?: string;
  select?: (
    data: AxiosResponse<IBuddiesResponseDto, any>
  ) => AxiosResponse<IBuddiesResponseDto, any>;
  // select?: (data: any) => any;
}

export const useBuddies = ({ text, select }: IUseBuddiesProps = {}) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();

  const invalidateBuddies = () => queryClient.invalidateQueries(['buddies']);

  const { data: { data: { buddies = [] } = {} } = {}, isLoading } = useQuery(
    ['buddies', userInfo?.id, text],
    () => getBuddies(Number(userInfo?.id), text),
    {
      onError: () => {
        toast.error(`Failed to load buddies`);
      },
      enabled: !!userInfo?.id,
      select
    }
  );

  return { buddies, isLoading, invalidateBuddies };
};
