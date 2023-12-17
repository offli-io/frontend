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
import { CustomizationContext } from '../../assets/theme/customization-provider';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { FOOTER_HEIGHT } from '../../utils/common-constants';
import { mapLocationToNavigatorValue } from './utils/map-location-to-navigator-value.util';

interface IBottomNavigatorProps {
  sx?: SxProps;
}

const BottomNavigator: React.FC<IBottomNavigatorProps> = () => {
  const { palette } = useTheme();
  const [value, setValue] = React.useState<ApplicationLocations>(ApplicationLocations.EXPLORE);
  const { mode } = React.useContext(CustomizationContext);

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
      elevation={3}>
      <BottomNavigation
        showLabels
        value={mapLocationToNavigatorValue(value)}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          margin: 'auto',
          '& .Mui-selected': {
            fontSize: '12px !important'
            // color: "primary.main",
          },
          color: palette?.background?.default,
          bgcolor: palette?.background?.default
        }}
        data-testid="bottom-navigator">
        <BottomNavigationAction
          label="Explore"
          icon={
            <TravelExploreIcon
              sx={{
                color: value === ApplicationLocations.EXPLORE ? 'primary.main' : undefined
              }}
            />
          }
          component={Link}
          value={ApplicationLocations.EXPLORE}
          to={ApplicationLocations.EXPLORE}
          data-testid="navigator-activities"
          sx={{
            ...(mode === 'dark' ? { color: palette?.text?.primary } : {})
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
              <AddCircleOutlineIcon />
            )
          }
          component={Link}
          value={ApplicationLocations.CREATE}
          to={ApplicationLocations.CREATE}
          data-testid="navigator-create"
          sx={{
            ...(mode === 'dark' ? { color: palette?.text?.primary } : {})
          }}
        />
        <BottomNavigationAction
          label="Activities"
          icon={
            value === ApplicationLocations.ACTIVITIES ? (
              <LocalActivityIcon
                sx={{
                  color: 'primary.main'
                }}
              />
            ) : (
              <LocalActivityOutlinedIcon />
            )
          }
          component={Link}
          value={ApplicationLocations.ACTIVITIES}
          to={ApplicationLocations.ACTIVITIES}
          data-testid="navigator-activities"
          sx={{
            ...(mode === 'dark' ? { color: palette?.text?.primary } : {})
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavigator;
