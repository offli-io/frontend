import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { IconButton, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationLocations } from 'types/common/applications-locations.dto';

export interface IBuddiesButtonProps {
  buddyCount?: number;
}

const BuddyButton: React.FC<IBuddiesButtonProps> = ({ buddyCount }) => {
  const navigate = useNavigate();
  return (
    <IconButton
      color="primary"
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
        height: 40,
        px: 1.5,
        mt: 1,
        mr: 1,
        borderRadius: '15px',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: (theme) => theme.palette.primary.main,
        position: 'absolute',
        right: 0
      }}
      onClick={() => navigate(ApplicationLocations.BUDDIES)}
      data-testid="buddies-btn">
      <PeopleAltIcon sx={{ fontSize: 18, padding: 0, color: 'primary.main' }} />
      <Typography
        variant="subtitle1"
        color="primary"
        sx={{
          fontWeight: 'bold',
          ml: 0.75
        }}>
        {`${buddyCount} ${buddyCount === 1 ? 'Buddy' : 'Buddies'}`}
      </Typography>
    </IconButton>
  );
};

export default BuddyButton;
