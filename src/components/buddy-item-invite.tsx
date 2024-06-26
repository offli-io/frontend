import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import userPlaceholder from '../assets/img/user-placeholder.svg';

import { useGetApiUrl } from '../hooks/utils/use-get-api-url';
import { IPerson } from '../types/activities/activity.dto';
import OffliButton from './offli-button';

interface ILabeledDividerProps {
  imageSource?: string;
  onInviteClick?: (person: IPerson) => void;
  buddy: IPerson;
  children?: React.ReactElement;
  invited?: boolean;
  isLoading?: boolean;
}

const BuddyItemInvite: React.FC<ILabeledDividerProps> = ({
  buddy,
  onInviteClick,
  invited,
  isLoading,
  ...rest
}) => {
  const { shadows } = useTheme();
  const baseUrl = useGetApiUrl();
  return (
    <Box
      //onClick={() => handleClick(checked)}
      sx={{
        display: 'grid',
        gridTemplateColumns: '7fr 1fr',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
        textTransform: 'none',
        width: '100%'
      }}
      {...rest}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          mr: 1
        }}>
        <img
          src={buddy?.profile_photo ? `${baseUrl}/files/${buddy?.profile_photo}` : userPlaceholder}
          style={{
            margin: 0.5,
            height: 40,
            borderRadius: '50%',
            boxShadow: shadows?.[2]
          }}
          alt="profile"
        />
        <Typography sx={{ ml: 2 }}>{buddy?.username}</Typography>
      </Box>
      <OffliButton
        sx={{ height: 38, fontSize: 16, mr: 2, width: 90, borderRadius: 4 }}
        onClick={() => onInviteClick && onInviteClick(buddy)}
        variant={invited ? 'outlined' : 'contained'}
        data-testid={`toggle-buddy-invite-btn-${buddy?.username}`}
        disabled={isLoading}>
        {invited ? 'Cancel' : 'Invite'}
      </OffliButton>
    </Box>
  );
};
export default BuddyItemInvite;
