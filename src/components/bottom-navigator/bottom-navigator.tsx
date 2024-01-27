import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { Paper, SxProps, useTheme } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { CustomizationContext } from '../../context/providers/customization-provider';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { FOOTER_HEIGHT } from '../../utils/common-constants';
import { mapLocationToNavigatorValue } from './utils/map-location-to-navigator-value.util';
import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';
import { TabDefinitionsEnum } from 'screens/activities-screen/utils/tab-definitions';

interface IBottomNavigatorProps {
  sx?: SxProps;
}

const BottomNavigator: React.FC<IBottomNavigatorProps> = () => {
  const { palette } = useTheme();
  const [value, setValue] = React.useState<ApplicationLocations>(ApplicationLocations.EXPLORE);
  const { theme } = React.useContext(CustomizationContext);

  return (
    <Paper
      sx={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: FOOTER_HEIGHT,
        bgcolor: palette?.background?.default
      }}
      //TODO either Box with boxShadow as sx or Paper with elevation 3 - need to compare
      // sx={sx}
      elevation={theme === ThemeOptionsEnumDto.LIGHT ? 3 : 8}>
      <BottomNavigation
        showLabels
        value={mapLocationToNavigatorValue(value)}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          color: palette?.background?.default,
          bgcolor: palette?.background?.default
        }}
        data-testid="bottom-navigator">
        <BottomNavigationAction
          label="Explore"
          icon={
            <TravelExploreIcon
              sx={{
                color: value === ApplicationLocations.EXPLORE ? 'primary.main' : undefined,
                fontSize: value === ApplicationLocations.EXPLORE ? 24 : 20
              }}
            />
          }
          component={Link}
          value={ApplicationLocations.EXPLORE}
          to={ApplicationLocations.EXPLORE}
          data-testid="navigator-activities"
          sx={{
            fontSize: value === ApplicationLocations.EXPLORE ? 10 : 8,
            ...(theme === ThemeOptionsEnumDto.DARK ? { color: palette?.text?.primary } : {})
          }}
        />
        <BottomNavigationAction
          label="Create"
          icon={
            value === ApplicationLocations.CREATE ? (
              <AddCircleIcon
                sx={{
                  color: 'primary.main'
                }}
              />
            ) : (
              <AddCircleOutlineIcon sx={{ fontSize: 20 }} />
            )
          }
          component={Link}
          value={ApplicationLocations.CREATE}
          to={ApplicationLocations.CREATE}
          data-testid="navigator-create"
          sx={{
            fontSize: value === ApplicationLocations.CREATE ? 10 : 8,
            ...(theme === ThemeOptionsEnumDto.DARK ? { color: palette?.text?.primary } : {})
          }}
        />
        <BottomNavigationAction
          label="My Activities"
          icon={
            value === ApplicationLocations.ACTIVITIES ? (
              <LocalActivityIcon
                sx={{
                  color: 'primary.main'
                }}
              />
            ) : (
              <LocalActivityOutlinedIcon sx={{ fontSize: 20 }} />
            )
          }
          component={Link}
          value={ApplicationLocations.ACTIVITIES}
          to={`${ApplicationLocations.ACTIVITIES}/${TabDefinitionsEnum.UPCOMING}`}
          data-testid="navigator-activities"
          sx={{
            fontSize: value === ApplicationLocations.ACTIVITIES ? 10 : 8,
            ...(theme === ThemeOptionsEnumDto.DARK ? { color: palette?.text?.primary } : {})
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavigator;
