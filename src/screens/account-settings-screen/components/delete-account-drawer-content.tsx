import { Box, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeAccount } from 'api/auth/requests';
import { AuthenticationContext } from 'components/context/providers/authentication-provider';
import OffliButton from 'components/offli-button';
import { useUserSettings } from 'hooks/users/use-user-settings';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ApplicationLocations } from 'types/common/applications-locations.dto';
import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';
import { setThemeToStorage } from 'utils/storage.util';
import { setAuthToken } from 'utils/token.util';

const DeleteAccountDrawerContent = () => {
  const navigate = useNavigate();
  const { userInfo, setStateToken, setUserInfo } = React.useContext(AuthenticationContext);
  const { data: { data: { theme = ThemeOptionsEnumDto.LIGHT } = {} } = {} } = useUserSettings();
  const queryClient = useQueryClient();

  //   const [password, setPassword] = React.useState('');
  //   const [showPassword, setShowPassword] = React.useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const { isLoading, mutate: sendRemoveAccount } = useMutation(
    ['delete-account'],
    () => {
      abortControllerRef.current = new AbortController();
      return removeAccount(
        {
          id: userInfo?.id
        },
        abortControllerRef?.current?.signal
      );
    },
    {
      onSuccess: () => {
        toast.success('Your account has been successfully deleted');
        setStateToken(null);
        setAuthToken(undefined);
        setUserInfo?.({ username: undefined, id: undefined });
        queryClient.invalidateQueries();
        queryClient.removeQueries();
        if (theme === ThemeOptionsEnumDto.LIGHT) {
          setThemeToStorage(ThemeOptionsEnumDto.LIGHT);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate(ApplicationLocations.LOGIN);
      },
      onError: () => {
        toast.error('Failed to delete your account');
      }
    }
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 4 }}>
      <Typography variant="h2" sx={{ textAlign: 'center', mb: 1 }}>
        Do you really want to remove your account?
      </Typography>
      <Typography sx={{ textAlign: 'center' }}>
        This action will be permanent and you will loose full access to Offli
      </Typography>
      <OffliButton
        data-testid="submit-btn"
        sx={{ my: 4, width: '70%' }}
        type="submit"
        isLoading={isLoading}
        onClick={() => sendRemoveAccount()}>
        Remove account
      </OffliButton>
    </Box>
  );
};

export default DeleteAccountDrawerContent;
