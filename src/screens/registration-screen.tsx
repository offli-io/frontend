import { yupResolver } from '@hookform/resolvers/yup';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, IconButton, InputAdornment, TextField, Typography, useTheme } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { PickUsernameTypeEnum } from 'types/common/pick-username-type-enum.dto';
import * as yup from 'yup';
import { checkIfEmailAlreadyTaken } from '../api/users/requests';
import LabeledDivider from '../components/labeled-divider';
import OffliBackButton from '../components/offli-back-button';
import OffliButton from '../components/offli-button';
import { useGoogleAuthorization } from '../hooks/use-google-authorization';
import { ApplicationLocations } from '../types/common/applications-locations.dto';
import { GoogleAuthCodeFromEnumDto } from '../types/google/google-auth-code-from-enum.dto';
import { IEmailPassword } from '../types/users/user.dto';

const schema: () => yup.SchemaOf<IEmailPassword> = () =>
  yup.object({
    email: yup
      .string()
      .email('Email must be a valid email')
      .defined()
      .required('Please enter your email'),
    password: yup
      .string()
      .defined()
      .required('Please enter your password')
      .min(8, 'Password must be at least 8 characters long')
      .max(16, 'Password must be less than 16 characters long')
      .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase')
      .matches(/^(?=.*[0-9])/, 'Password must contain at least one number')
  });

export const RegistrationScreen: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState<string | undefined>();
  const { palette } = useTheme();

  const { googleAuthCode, handleGoogleAuthorization } = useGoogleAuthorization({
    from: GoogleAuthCodeFromEnumDto.REGISTER,
    omitTokenGetting: true
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: emailAlreadyTaken, isLoading } = useQuery<any>(
    ['email-taken', email],
    () => checkIfEmailAlreadyTaken(email),
    {
      enabled: !!email
    }
  );

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { control, handleSubmit, setError, formState } = useForm<IEmailPassword>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(schema()),
    mode: 'onChange'
  });

  // console.log(formState?.errors)

  React.useEffect(() => {
    if (googleAuthCode) {
      queryClient.setQueryData(['google-token'], googleAuthCode);
      navigate(ApplicationLocations.PICK_USERNAME, {
        state: {
          type: PickUsernameTypeEnum.GOOGLE
        }
      });
    }
  }, [googleAuthCode]);

  const isEmailInUse = Object.keys(formState?.errors)?.length !== 0;

  const handleFormSubmit = React.useCallback((values: IEmailPassword) => {
    queryClient.setQueryData(['registration-email-password'], values);
    navigate(ApplicationLocations.PICK_USERNAME, {
      state: { type: PickUsernameTypeEnum.REGULAR }
    });
    // TODO if navigating from google pass type GOOGLE
  }, []);

  React.useEffect(() => {
    if (emailAlreadyTaken?.data) {
      setError('email', { message: 'Email already in use' });
    }
  }, [emailAlreadyTaken]);

  return (
    <>
      <OffliBackButton
        onClick={() => navigate(ApplicationLocations.LOGIN_OR_REGISTER)}
        sx={{ alignSelf: 'flex-start', m: 1, color: palette?.primary?.main }}>
        Back
      </OffliBackButton>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
            //   justifyContent: 'center',
          }}>
          <Typography
            variant="h1"
            gutterBottom
            sx={{
              my: 5,
              display: 'flex',
              color: ({ palette }) => palette?.text?.primary
            }}>
            Your offline life.
          </Typography>

          <OffliButton
            startIcon={<GoogleIcon sx={{ color: palette?.background?.default }} />}
            onClick={handleGoogleAuthorization}
            sx={{ mb: 1 }}>
            Sign up with Google
          </OffliButton>

          <LabeledDivider sx={{ my: 1 }}>
            <Typography variant="subtitle1">or</Typography>
          </LabeledDivider>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              alignItems: 'center',
              mb: 7
            }}>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  //   label="Username"
                  placeholder="Email"
                  error={!!error}
                  helperText={error?.message}
                  //disabled={methodSelectionDisabled}
                  sx={{ width: '80%', mb: 2 }}
                  onBlur={(event) => setEmail(event.target.value)}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  //label="Username"
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  // variant="filled"
                  error={!!error}
                  helperText={error?.message}
                  //disabled={methodSelectionDisabled}
                  sx={{ width: '80%' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? (
                            <VisibilityIcon sx={{ color: 'lightgrey' }} />
                          ) : (
                            <VisibilityOffIcon sx={{ color: 'lightgrey' }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            <Typography
              variant="subtitle1"
              align="center"
              sx={{
                color: 'lightgrey',
                mt: 2,
                lineHeight: 1.2
              }}>
              By signing up, you agree to the terms of the <br />
              Offli <b>Privacy Policy</b> and <b>Cookie Policy</b>.
            </Typography>
          </Box>

          <OffliButton
            type="submit"
            sx={{ width: '70%', mb: 5 }}
            disabled={!formState?.isValid || isEmailInUse || isLoading}>
            Register
          </OffliButton>
        </Box>
      </form>
    </>
  );
};

export default RegistrationScreen;
