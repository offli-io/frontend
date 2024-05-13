import { yupResolver } from '@hookform/resolvers/yup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, IconButton, InputAdornment, TextField, Typography, useTheme } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import Logo from 'components/logo';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as yup from 'yup';
import { loginUser } from '../../api/auth/requests';
import OffliBackButton from '../../components/offli-back-button';
import OffliButton from '../../components/offli-button';
import { AuthenticationContext } from '../../context/providers/authentication-provider';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
export interface FormValues {
  username: string;
  password: string;
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    username: yup.string().defined().required(),
    password: yup.string().defined().required()
  });

const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { setUserInfo, setStateToken, userInfo } = React.useContext(AuthenticationContext);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      username: '',
      password: ''
    },
    resolver: yupResolver(schema()),
    mode: 'onChange'
  });

  const { isLoading, mutate: sendLogin } = useMutation(
    ['login'],
    (formValues: FormValues) => {
      return loginUser(formValues);
    },
    {
      onSuccess: (data, params) => {
        // setAuthToken(data?.data?.access_token)
        // setRefreshToken(data?.data?.refresh_token)
        //TODO refresh user Id after refresh
        setStateToken(data?.data?.token?.access_token ?? null);
        setUserInfo?.({ username: params?.username, id: data?.data?.user_id });
        localStorage.setItem('userId', String(data?.data?.user_id));
        navigate(ApplicationLocations.EXPLORE);
      },
      onError: () => {
        toast.error('Failed to log in');
      }
    }
  );

  const handleFormSubmit = React.useCallback(
    (values: FormValues) => sendLogin(values),
    [sendLogin]
  );

  React.useEffect(() => {
    if (userInfo?.id) {
      //Hacky way but I dont have any other way to implement it now
      navigate(ApplicationLocations.EXPLORE);
    }
  }, [userInfo?.id]);

  return (
    <>
      <OffliBackButton
        onClick={() => navigate(ApplicationLocations.AUTHENTICATION_METHOD)}
        sx={{ alignSelf: 'flex-start', m: 1, color: palette?.primary?.main }}>
        Back
      </OffliBackButton>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
            mt: 6
          }}>
          <Logo />
          <Box sx={{ display: 'flex', my: 2 }}>
            <Typography variant="h2">Your</Typography>
            <Typography variant="h2" sx={{ mx: 0.75, color: 'primary.main' }}>
              offline
            </Typography>
            <Typography variant="h2">life.</Typography>
          </Box>
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                data-testid="username-input"
                label="Email or username"
                error={!!error}
                sx={{ width: '80%', mb: 2 }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                data-testid="password-input"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                error={!!error}
                sx={{ width: '80%' }}
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
            )}
          />

          <OffliButton
            variant="text"
            disabled={isLoading}
            sx={{ fontSize: 14, mt: 1, mb: 7 }}
            onClick={() => navigate(ApplicationLocations.FORGOTTEN_PASSWORD)}
            data-testid="forgot-password-btn">
            Forgot your password?
          </OffliButton>
        </Box>
        <OffliButton
          data-testid="submit-btn"
          sx={{ width: '80%', mb: 5 }}
          type="submit"
          isLoading={isLoading}
          disabled={!formState?.isValid}>
          Login
        </OffliButton>
      </form>
    </>
  );
};

export default LoginScreen;
