import React from 'react';
// import ErrorIcon from '@mui/icons-material/Error'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { removeAccount } from 'api/auth/requests';
import OffliButton from 'components/offli-button';
import { AuthenticationContext } from 'context/providers/authentication-provider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const DeleteAccountDrawerContent = () => {
  const navigate = useNavigate();
  const { userInfo } = React.useContext(AuthenticationContext);
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const { isLoading, mutate: sendRemoveAccount } = useMutation(
    ['delete-account'],
    (password?: string) => {
      abortControllerRef.current = new AbortController();
      return removeAccount(
        {
          password,
          email: String(userInfo?.email)
        },
        abortControllerRef?.current?.signal
      );
    },
    {
      onSuccess: () => {
        toast.success('Your account has been successfully deleted');
        navigate(-1);
      },
      onError: () => {
        toast.error('Failed to change your password');
      }
    }
  );

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 4 }}>
      <Typography variant="h2" sx={{ textAlign: 'center', mb: 1 }}>
        Do you really want to remove your account?
      </Typography>
      <Typography sx={{ textAlign: 'center', mb: 2 }}>
        This action will be permanent and you will loose full access to Offli
      </Typography>
      <TextField
        value={password}
        onChange={(e) => setPassword(e?.target?.value)}
        data-testid="password-input"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        sx={{ width: '90%' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <OffliButton
        data-testid="submit-btn"
        sx={{ my: 4, width: '70%' }}
        type="submit"
        isLoading={isLoading}
        disabled={!password}
        onClick={() => sendRemoveAccount(password)}>
        Remove account
      </OffliButton>
    </Box>
  );
};

export default DeleteAccountDrawerContent;
