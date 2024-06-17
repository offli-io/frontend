import { useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { IBuddiesResponseDto } from 'types/users/buddies-response.dto';
import { MAPVIEW_ACTIVITIES_QUERY_KEY } from '../../screens/map-screen';
import { ACTIVITIES_QUERY_KEY } from '../use-activities';
import { PAGED_ACTIVITIES_QUERY_KEY } from '../use-activities-infinite-query';
import { PARTICIPANT_ACTIVITIES_QUERY_KEY } from '../use-participant-activities';

export interface IUseBuddiesProps {
  text?: string;
  select?: (
    data: AxiosResponse<IBuddiesResponseDto, any>
  ) => AxiosResponse<IBuddiesResponseDto, any>;
  // select?: (data: any) => any;
}

export const useInvalidateQueryKeys = () => {
  const queryClient = useQueryClient();

  const activityCreatedOrEditedInvalidation = () => {
    queryClient.invalidateQueries([ACTIVITIES_QUERY_KEY]);
    queryClient.invalidateQueries([PAGED_ACTIVITIES_QUERY_KEY]);
    queryClient.invalidateQueries([MAPVIEW_ACTIVITIES_QUERY_KEY]);
    queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);
  };

  return { activityCreatedOrEditedInvalidation };
};
