import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import shadows from '@mui/material/styles/shadows';
import OffliButton from 'components/offli-button';
import { CustomizationContext } from 'context/providers/customization-provider';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationLocations } from 'types/common/applications-locations.dto';
import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';

export interface IBuddiesButtonProps {
  buddyCount?: number;
}

const BuddyButton: React.FC<IBuddiesButtonProps> = ({ buddyCount }) => {
  const navigate = useNavigate();
  const { theme } = React.useContext(CustomizationContext);

  return (
    <OffliButton
      sx={{
        height: 40,
        px: 1.5,
        mt: 1,
        mr: 1,
        borderRadius: '15px',
        borderWidth: theme === ThemeOptionsEnumDto.LIGHT ? 1 : undefined,
        borderStyle: 'solid',
        bgcolor: ({ palette }) =>
          theme === ThemeOptionsEnumDto.LIGHT ? palette.primary.light : undefined,
        fontSize: 16,
        color: theme === ThemeOptionsEnumDto.LIGHT ? 'primary.main' : undefined,
        position: 'absolute',
        boxShadow: theme === ThemeOptionsEnumDto.DARK ? shadows[6] : undefined,
        right: 0
      }}
      startIcon={
        <PeopleAltIcon
          sx={{
            fontSize: 18,
            padding: 0,
            color: theme === ThemeOptionsEnumDto.LIGHT ? 'primary.main' : undefined
          }}
        />
      }
      onClick={() => navigate(ApplicationLocations.BUDDIES)}
      data-testid="buddies-btn">
      {`${buddyCount} ${buddyCount === 1 ? 'Buddy' : 'Buddies'}`}
    </OffliButton>
  );
};

export default BuddyButton;
