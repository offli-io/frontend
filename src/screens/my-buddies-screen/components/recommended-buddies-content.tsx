import { Box, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRecommendedBuddies } from 'api/activities/requests';
import BuddySuggestCard from 'components/buddy-suggest-card';
import { AuthenticationContext } from 'components/context/providers/authentication-provider';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSendBuddyRequest } from 'screens/profile-screen/hooks/use-send-buddy-request';
import { toast } from 'sonner';
import { IPerson } from 'types/activities/activity.dto';
import { ApplicationLocations } from 'types/common/applications-locations.dto';

const RecommendedBuddiesContent = () => {
  const navigate = useNavigate();
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();

  const { handleSendBuddyRequest, isSendingBuddyRequest } = useSendBuddyRequest({
    onSuccess: () => {
      queryClient.invalidateQueries(['recommended-buddies']);
    }
  });

  const { data: recommendedBuddiesData } = useQuery(
    ['recommended-buddies', userInfo?.id],
    () => getRecommendedBuddies(userInfo?.id ?? -1),
    {
      onError: () => {
        toast.error(`Failed to load recommended buddies`);
      },
      enabled: !!userInfo?.id
    }
  );

  const handleBuddySuggestAddClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, buddy: IPerson) => {
      e.stopPropagation();
      handleSendBuddyRequest(buddy?.id);
    },
    []
  );

  return (
    <>
      {(recommendedBuddiesData?.data ?? [])?.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            People you attended activity with
          </Typography>
          <Box
            sx={{
              display: 'flex',
              overflowX: 'scroll',
              width: '100%',
              '::-webkit-scrollbar': { display: 'none' }
            }}>
            {recommendedBuddiesData?.data?.map((buddy) => (
              <BuddySuggestCard
                key={buddy?.id}
                buddy={buddy}
                onAddBuddyClick={handleBuddySuggestAddClick}
                isLoading={isSendingBuddyRequest}
                onClick={(buddy) => navigate(`${ApplicationLocations.USER_PROFILE}/${buddy?.id}`)}
              />
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default RecommendedBuddiesContent;
