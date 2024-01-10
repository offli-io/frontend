import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import OffliButton from 'components/offli-button';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationLocations } from 'types/common/applications-locations.dto';

export interface IBuddiesButtonProps {
  buddyCount?: number;
}

const BuddyButton: React.FC<IBuddiesButtonProps> = ({ buddyCount }) => {
  const navigate = useNavigate();
  return (
    <OffliButton
      sx={{
        height: 40,
        px: 1.5,
        mt: 1,
        mr: 1,
        borderRadius: '15px',
        borderWidth: 1,
        borderStyle: 'solid',
        // borderColor: (theme) => theme.palette.primary.light,
        bgcolor: (theme) => theme.palette.primary.light,
        fontSize: 16,
        color: 'primary.main',
        position: 'absolute',
        right: 0
      }}
      startIcon={<PeopleAltIcon sx={{ fontSize: 18, padding: 0, color: 'primary.main' }} />}
      onClick={() => navigate(ApplicationLocations.BUDDIES)}
      data-testid="buddies-btn">
      {`${buddyCount} ${buddyCount === 1 ? 'Buddy' : 'Buddies'}`}
    </OffliButton>
  );
};

export default BuddyButton;
