import DarkModeIcon from '@mui/icons-material/DarkMode';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Box, Switch } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useUserSettings } from 'hooks/use-user-settings';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';
import { ABOUT_US_LINK, HELP_SUPPORT_LINK, PRIVACY_POLICY_LINK } from 'utils/common-constants';
import { getPlatfromFromStorage } from 'utils/storage.util';
import MenuItem from '../../components/menu-item';
import { AuthenticationContext } from '../../context/providers/authentication-provider';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { SettingsTypeEnumDto } from '../../types/common/settings-type-enum.dto';
import { setAuthToken } from '../../utils/token.util';
import { useToggleTheme } from './hooks/use-toggle-theme';
import { SettingsItemsObject } from './settings-items-object';

const SettingsScreen = () => {
  const isNotificationPermissionGranted = Notification.permission === 'granted';

  const { setStateToken, setUserInfo } = React.useContext(AuthenticationContext);
  const [notificationPermissionGranted, setNotificationPermissionGranted] = React.useState(
    isNotificationPermissionGranted
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: { data: { theme = ThemeOptionsEnumDto.LIGHT } = {} } = {} } = useUserSettings();
  const { handleToggleTheme } = useToggleTheme();

  const handleLogout = React.useCallback(() => {
    //TODO double check if any security issues aren't here I am not sure about using tokens from 2 places
    setStateToken(null);
    setAuthToken(undefined);
    setUserInfo?.({ username: undefined, id: undefined });
    queryClient.invalidateQueries();
    queryClient.removeQueries();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate(ApplicationLocations.LOGIN);
  }, [setStateToken]);

  const handleMenuItemClick = React.useCallback(
    async (type?: unknown) => {
      const correctType = type as SettingsTypeEnumDto;
      switch (correctType) {
        case SettingsTypeEnumDto.ACCOUNT:
          return navigate(ApplicationLocations.ACCOUNT_SETTINGS);
        case SettingsTypeEnumDto.TERM_PRIVACY:
          return window.open(PRIVACY_POLICY_LINK);
        case SettingsTypeEnumDto.HELP_SUPPORT:
          return window.open(HELP_SUPPORT_LINK);
        case SettingsTypeEnumDto.NOTIFICATIONS:
          return await Notification.requestPermission();
        default:
          return;
      }
      //TODO double check if any security issues aren't here I am not sure about using tokens from 2 places
    },
    [setStateToken]
  );

  const handleNotificationSettingsChange = React.useCallback(async () => {
    try {
      if (!isNotificationPermissionGranted) {
        await Notification.requestPermission();
        setNotificationPermissionGranted(true);
      }
    } catch (error) {
      console.error('Error granting notifications permission', error);
    }
  }, []);

  const isMobile = !!getPlatfromFromStorage();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh'
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {SettingsItemsObject.map((item) => (
          <MenuItem
            label={item?.label}
            type={item?.type}
            icon={item.icon}
            key={`settings_${item?.type}`}
            onMenuItemClick={handleMenuItemClick}
            headerRight={<></>}
          />
        ))}

        {!isMobile ? (
          <MenuItem
            label="Notifications"
            type={SettingsTypeEnumDto.NOTIFICATIONS}
            icon={<NotificationsIcon color="primary" />}
            // onMenuItemClick={async () => {
            //   await Notification.requestPermission();
            // }}
            headerRight={
              <Switch
                checked={notificationPermissionGranted}
                onChange={handleNotificationSettingsChange}
              />
            }
          />
        ) : null}

        <MenuItem
          label="Dark theme"
          type={SettingsTypeEnumDto.DARK_THEME}
          icon={<DarkModeIcon color="primary" />}
          headerRight={
            <Switch
              checked={theme === ThemeOptionsEnumDto.DARK}
              onChange={() =>
                handleToggleTheme(
                  theme === ThemeOptionsEnumDto.LIGHT
                    ? ThemeOptionsEnumDto.DARK
                    : ThemeOptionsEnumDto.LIGHT
                )
              }
            />
          }
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <MenuItem
          label="About"
          type={SettingsTypeEnumDto.ABOUT}
          icon={<InfoIcon color="primary" />}
          headerRight={<></>}
          onMenuItemClick={() => window.open(ABOUT_US_LINK)}
        />
        <MenuItem
          label="Log out"
          type={SettingsTypeEnumDto.LOGOUT}
          icon={<LogoutIcon color="primary" />}
          headerRight={<></>}
          onMenuItemClick={handleLogout}
        />
      </Box>
    </Box>
  );
};

export default SettingsScreen;
