import DarkModeIcon from '@mui/icons-material/DarkMode';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Switch } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useUserSettings } from 'hooks/use-user-settings';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';
import { AuthenticationContext } from '../../assets/theme/authentication-provider';
import MenuItem from '../../components/menu-item';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { SettingsTypeEnumDto } from '../../types/common/settings-type-enum.dto';
import { setAuthToken } from '../../utils/token.util';
import { useToggleTheme } from './hooks/use-toggle-theme';
import { SettingsItemsObject } from './settings-items-object';

const SettingsScreen = () => {
  const { setStateToken, setUserInfo } = React.useContext(AuthenticationContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: { data: { data: { theme = ThemeOptionsEnumDto.LIGHT } = {} } = {} } = {} } =
    useUserSettings();
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
    (type?: unknown) => {
      const correctType = type as SettingsTypeEnumDto;
      switch (correctType) {
        case SettingsTypeEnumDto.ACCOUNT:
          return navigate(ApplicationLocations.ACCOUNT_SETTINGS);
        default:
          return;
      }
      //TODO double check if any security issues aren't here I am not sure about using tokens from 2 places
    },
    [setStateToken]
  );

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
          />
        ))}
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
