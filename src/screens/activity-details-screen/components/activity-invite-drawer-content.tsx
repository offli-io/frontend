import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import Loader from 'components/loader';
import { useBuddies } from 'hooks/use-buddies';
import React from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { inviteBuddyToActivity, uninviteBuddy } from '../../../api/activities/requests';
import { AuthenticationContext } from '../../../assets/theme/authentication-provider';
import BuddyItemInvite from '../../../components/buddy-item-invite';
import { ActivityInviteStateEnum } from '../../../types/activities/activity-invite-state-enum.dto';
import { IPerson } from '../../../types/activities/activity.dto';
import InviteActionButtons from './invite-action-buttons';

interface IActivityTypeFormProps {
  activityId?: number;
  activityTitle?: string;
  activityPhoto?: string;
}

export const ActivityInviteDrawerContent: React.FC<IActivityTypeFormProps> = ({
  activityId,
  activityTitle,
  activityPhoto
}) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const [invitedBuddies, setInvitedBuddies] = React.useState<number[]>([]);
  const [queryString, setQueryString] = React.useState<string | undefined>();
  const [queryStringDebounced] = useDebounce(queryString, 1000);

  const { buddies, isLoading } = useBuddies({
    text: queryStringDebounced
  });

  const { mutate: sendInviteBuddy, isLoading: isInviting } = useMutation(
    ['invite-participant'],
    (buddy?: IPerson) =>
      inviteBuddyToActivity(Number(activityId), Number(buddy?.id), {
        status: ActivityInviteStateEnum.INVITED,
        invited_by_id: Number(userInfo?.id)
      }),
    {
      onSuccess: (data, buddy) => {
        setInvitedBuddies([...invitedBuddies, Number(buddy?.id)]);
      },
      onError: () => {
        toast.error('Failed to invite user');
      }
    }
  );

  const { mutate: sendUninviteBuddy, isLoading: isUninviting } = useMutation(
    ['uninvite-person'],
    (buddyId?: number) => uninviteBuddy(Number(activityId), Number(buddyId)),
    {
      onSuccess: (data, buddyId) => {
        const _buddies = invitedBuddies?.filter((buddy) => buddy !== buddyId);
        setInvitedBuddies(_buddies);
      },
      onError: () => {
        toast.error('Failed to cancel invite for user');
      }
    }
  );

  const handleBuddyInviteClick = React.useCallback(
    (buddy: IPerson) => {
      //fire request for invite
      if (invitedBuddies?.includes(Number(buddy?.id))) {
        sendUninviteBuddy(buddy?.id);
      } else {
        sendInviteBuddy(buddy);
      }
    },
    [invitedBuddies, sendInviteBuddy, sendUninviteBuddy]
  );

  return (
    <Box sx={{ height: 450, overflow: 'auto', px: 1.5 }}>
      <Box sx={{ display: 'flex', mb: 3, mt: 2 }}>
        <Typography sx={{ fontWeight: 'bold' }} variant="h4">
          Send invites to your buddies
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          width: '100%'
        }}>
        <TextField
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
          sx={{
            width: '100%',
            '& input::placeholder': {
              fontSize: 14,
              color: '#4A148C',
              fontWeight: 400,
              opacity: 1,
              pl: 1
            },
            '& fieldset': { border: 'none' },
            backgroundColor: ({ palette }) => palette?.primary?.light,
            borderRadius: '10px'
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: '1.5rem', color: 'primary.main' }} />{' '}
              </InputAdornment>
            )
          }}
          placeholder="Type buddy username"
          data-testid="activity-invite-buddies-input"
        />
        <InviteActionButtons activityTitle={activityTitle} activityPhoto={activityPhoto} />

        {buddies && buddies?.length < 1 && !isLoading ? (
          <Box
            sx={{
              height: 220,
              width: '100%',
              my: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderTop: '1px solid lightgrey',
              borderBottom: '1px solid lightgrey'
            }}>
            <Typography sx={{ color: (theme) => theme.palette.inactive.main }}>
              No buddies to invite
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              //   height: 300,
              width: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              my: 3,
              borderTop: '1px solid lightgrey',
              borderBottom: '1px solid lightgrey'
            }}>
            {isLoading ? (
              <Loader />
            ) : (
              buddies?.map((buddy) => (
                <BuddyItemInvite
                  key={buddy?.id}
                  onInviteClick={handleBuddyInviteClick}
                  buddy={buddy}
                  invited={invitedBuddies?.includes(Number(buddy?.id))}
                  isLoading={isInviting || isUninviting}
                />
              ))
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
