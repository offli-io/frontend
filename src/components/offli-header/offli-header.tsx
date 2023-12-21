import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { Badge, Box, IconButton, SxProps, useTheme } from '@mui/material';
import { useGetApiUrl } from 'hooks/use-get-api-url';
import { useUser } from 'hooks/use-user';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NOT_EXACT_UNALLOWED_URLS } from '../../app/layout';
import offliLogoDark from '../../assets/img/offli-logo-dark.svg';
import offliLogoLight from '../../assets/img/offli-logo-light.svg';
import userPlaceholder from '../../assets/img/user-placeholder.svg';
import { AuthenticationContext } from '../../assets/theme/authentication-provider';
import { useNotifications } from '../../hooks/use-notifications';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { ICustomizedLocationStateDto } from '../../types/common/customized-location-state.dto';
import { HEADER_HEIGHT } from '../../utils/common-constants';
import BackHeader from './components/back-header';
import { mapPathnameToHeaderTitle } from './utils/header-utils';

interface IProps {
  sx?: SxProps;
}

const OffliHeader: React.FC<IProps> = ({ sx }) => {
  const location = useLocation();
  const from = (location?.state as ICustomizedLocationStateDto)?.from;
  const navigate = useNavigate();
  const headerRef = React.useRef<HTMLElement | null>(null);
  const { userInfo } = React.useContext(AuthenticationContext);
  const { palette } = useTheme();

  const { data: { data = {} } = {} } = useUser({
    id: userInfo?.id
  });

  const baseUrl = useGetApiUrl();
  const { data: notificationsData } = useNotifications(userInfo?.id);

  //TODO add component non-depending logic like styles outside the components
  const iconStyle = { height: '24px', mr: -1 };
  const badgeStyle = {
    '& .MuiBadge-badge': {
      transform: 'scale(0.8)',
      right: -14,
      top: -10
    }
  };

  const displayBackHeader = React.useMemo(
    () =>
      [
        ApplicationLocations.SETTINGS,
        ApplicationLocations.EDIT_PROFILE,
        ApplicationLocations.CHOOSE_LOCATION,
        ApplicationLocations.MAP,
        ApplicationLocations.BUDDIES,
        ApplicationLocations.SEARCH,
        ApplicationLocations.NOTIFICATIONS,
        ApplicationLocations.ACCOUNT_SETTINGS
      ].includes(location?.pathname as ApplicationLocations) ||
      NOT_EXACT_UNALLOWED_URLS?.some((item) => location?.pathname.includes(item)) ||
      location.pathname.includes(ApplicationLocations.ACTIVITY_DETAIL) ||
      location.pathname.includes(ApplicationLocations.ACTIVITY_MEMBERS) ||
      location.pathname.includes(ApplicationLocations.ACTIVITY_INVITE_MEMBERS),
    [location]
  );

  const logoSrc = palette.mode === 'light' ? offliLogoDark : offliLogoLight;

  return (
    <Box
      ref={headerRef}
      sx={{
        minHeight: HEADER_HEIGHT,
        boxShadow: '1px 2px 2px #ccc',
        position: 'sticky',
        top: 0,
        boxSizing: 'border-box',
        // pt: 2,
        zIndex: 2000,
        bgcolor: palette.background.default,
        display: 'flex',
        ...sx
      }}>
      {displayBackHeader ? (
        <BackHeader
          title={mapPathnameToHeaderTitle(location?.pathname as ApplicationLocations)}
          to={from}
        />
      ) : (
        <Box
          sx={{
            width: '90%',
            margin: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <img
            src={logoSrc}
            alt="Offli logo"
            style={{ height: '40px' }}
            data-testid="offli-logo"
            onClick={() => navigate(ApplicationLocations.EXPLORE)}
          />
          <Box
            sx={{
              display: 'flex'
            }}>
            {location?.pathname === ApplicationLocations.PROFILE ? (
              <IconButton
                onClick={() => {
                  navigate(ApplicationLocations.SETTINGS, {
                    state: {
                      from: location?.pathname
                    }
                  });
                }}
                data-testid="settings-btn">
                <SettingsIcon
                  sx={{ iconStyle, ml: 0.5 }}
                  // sx={{ color: 'primary.main' }}
                />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => navigate(ApplicationLocations.PROFILE)}
                data-testid="profile-btn"
                // sx={{ pr: 0 }}
              >
                <img
                  src={
                    data?.profile_photo
                      ? `${baseUrl}/files/${data?.profile_photo}`
                      : userPlaceholder
                  }
                  alt="profile"
                  style={{
                    height: 26,
                    aspectRatio: 1,
                    borderRadius: '50%',
                    backgroundColor: palette?.background?.default,
                    border: `1px solid ${palette?.primary?.main}`
                  }}
                  data-testid="profile-img"
                />
              </IconButton>
            )}
            <IconButton
              onClick={() => {
                navigate(ApplicationLocations.NOTIFICATIONS, {
                  state: {
                    from: location?.pathname
                  }
                });
              }}
              data-testid="notifications-btn">
              <Badge badgeContent={notificationsData?.data?.unseen} color="primary" sx={badgeStyle}>
                {location?.pathname === ApplicationLocations.NOTIFICATIONS ? (
                  <NotificationsIcon sx={iconStyle} />
                ) : (
                  <NotificationsNoneOutlinedIcon
                    sx={iconStyle}
                    // sx={{ color: 'primary.main' }}
                  />
                )}
              </Badge>
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OffliHeader;
