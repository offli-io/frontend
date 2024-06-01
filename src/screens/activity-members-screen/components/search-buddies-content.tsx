import SearchIcon from '@mui/icons-material/Search';
import { Box, CircularProgress, InputAdornment, Typography, useTheme } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { getActivityParticipants, inviteBuddyToActivity } from '../../../api/activities/requests';
import BuddyItem from '../../../components/buddy-item';
import { AuthenticationContext } from '../../../components/context/providers/authentication-provider';
import OffliButton from '../../../components/offli-button';
import OffliTextField from '../../../components/offli-text-field';
import { useBuddies } from '../../../hooks/use-buddies';
import { ActivityInviteStateEnum } from '../../../types/activities/activity-invite-state-enum.dto';
import { IPerson } from '../../../types/activities/activity.dto';
import { isAlreadyParticipant } from '../../../utils/person.util';

interface IAddBuddiesContentProps {
  activityId?: number;
}

const SearchBuddiesContent: React.FC<IAddBuddiesContentProps> = ({ activityId }) => {
  const [username, setUsername] = React.useState('');
  const { userInfo } = React.useContext(AuthenticationContext);
  const { shadows } = useTheme();
  const [usernameDebounced] = useDebounce(username, 150);
  const queryClient = useQueryClient();

  const {
    data: { data: { participants = [] } = {} } = {},
    isLoading: areActivityParticipantsLoading
  } = useQuery(['activity-participants', activityId], () =>
    getActivityParticipants({ activityId: Number(activityId) })
  );

  const { buddies, isLoading: areBuddiesLoading } = useBuddies({
    text: usernameDebounced
    // select: (data) => ({
    //   ...data,
    //   data: data?.data?.filter(
    //     (buddy) => !isAlreadyParticipant(participants, buddy)
    //   ),
    // }),
  });

  const { mutate: sendInviteBuddy, isLoading: isInviting } = useMutation(
    ['invite-participant'],
    (buddy?: IPerson) =>
      inviteBuddyToActivity(Number(activityId), Number(buddy?.id), {
        status: ActivityInviteStateEnum.INVITED,
        invited_by_id: Number(userInfo?.id)
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['activity-participants']);
        // setInvitedBuddies([...invitedBuddies, Number(buddy?.id)]);
      },
      onError: () => {
        toast.error('Failed to invite user');
      }
    }
  );

  const invitableBuddies = React.useMemo(
    () => buddies?.filter?.((buddy) => !isAlreadyParticipant(participants, buddy)),
    [buddies, participants]
  );

  const handleBuddyInviteClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, user: IPerson) => {
      e.stopPropagation();
      sendInviteBuddy(user);
    },
    [sendInviteBuddy]
  );

  const isLoading = areBuddiesLoading || areActivityParticipantsLoading || isInviting;

  return (
    <Box sx={{ height: 450, position: 'relative', overflow: 'hidden' }}>
      <OffliTextField
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          '& .MuiOutlinedInput-root': {
            pr: 0,
            boxShadow: shadows[1]
          },
          '& input::placeholder': {
            fontSize: 14
          },
          // TODO searchbar is scrolling with its content
          position: 'sticky',
          top: 0,
          bgcolor: 'white',
          maxHeight: 50,
          zIndex: 555,
          my: 1
        }}
        value={username}
        placeholder="Search among users"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: '1.2rem' }} />
            </InputAdornment>
          )
        }}
        onChange={(e) => setUsername(e.target.value)}
      />

      <Box sx={{ overflowY: 'auto', height: '100%', px: 1.5 }}>
        {invitableBuddies?.length < 1 && !isLoading ? (
          <Box
            sx={{
              height: 100,
              width: '100%',
              mt: 7,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Typography sx={{ color: (theme) => theme.palette.inactive.main }}>
              No users found
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              height: 300,
              width: '100%'
            }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              invitableBuddies?.map((user: IPerson) => (
                <BuddyItem
                  key={user?.id}
                  buddy={user}
                  actionContent={
                    <OffliButton
                      sx={{ fontSize: 16 }}
                      size="small"
                      onClick={(e) => handleBuddyInviteClick(e, user)}>
                      Invite
                    </OffliButton>
                  }
                />
              ))
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SearchBuddiesContent;
