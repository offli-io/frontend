import { yupResolver } from '@hookform/resolvers/yup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Typography,
  useTheme
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Logo from 'components/logo';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { PickUsernameTypeEnum } from 'types/common/pick-username-type-enum.dto';
import { PRIVACY_POLICY_LINK } from 'utils/common-constants';
import * as yup from 'yup';
import { checkIfEmailAlreadyTaken } from '../../api/users/requests';
import OffliBackButton from '../../components/offli-back-button';
import OffliButton from '../../components/offli-button';
import OffliTextField from '../../components/offli-text-field';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { IEmailPassword } from '../../types/users/user.dto';

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
      .matches(/^(?=.*[0-9])/, 'Password must contain at least one number'),
    policiesAgree: yup.bool().oneOf([true], 'Field must be checked')
  });

export const RegistrationScreen: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState<string | undefined>();
  const { palette } = useTheme();

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
      password: '',
      policiesAgree: false
    },
    resolver: yupResolver(schema()),
    mode: 'onChange'
  });

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
        onClick={() => navigate(ApplicationLocations.AUTHENTICATION_METHOD)}
        sx={{ alignSelf: 'flex-start', m: 1, color: palette?.primary?.main }}>
        Back
      </OffliBackButton>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 4
          }}
          data-testid="registration-inputs">
          <Logo />
          <Box sx={{ display: 'flex', my: 2 }}>
            <Typography variant="h2">Your</Typography>
            <Typography variant="h2" sx={{ mx: 0.75, color: 'primary.main' }}>
              offline
            </Typography>
            <Typography variant="h2">life.</Typography>
          </Box>
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
                <OffliTextField
                  {...field}
                  placeholder="Email"
                  error={!!error}
                  helperText={error?.message}
                  sx={{ width: '80%', mb: 2 }}
                  onBlur={(event) => setEmail(event.target.value)}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <OffliTextField
                  {...field}
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  error={!!error}
                  helperText={error?.message}
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

            <Controller
              name="policiesAgree"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(e) => {
                        onChange(e?.target?.checked ? true : false);
                      }}
                      data-testid="policies-checkbox"
                      sx={{
                        '& .MuiSvgIcon-root': {
                          color: 'primary.main'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="subtitle1"
                      align="center"
                      sx={{
                        width: '70%',
                        lineHeight: 1.2,
                        display: 'inline'
                      }}>
                      I agree to the terms of the Offli{' '}
                      <Link href={PRIVACY_POLICY_LINK} sx={{ mx: 0.5 }}>
                        Privacy Policy
                      </Link>
                      and
                      <Link href={PRIVACY_POLICY_LINK} sx={{ mx: 0.5 }}>
                        Cookie Policy
                      </Link>
                    </Typography>
                  }
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 2,
                    color: palette?.text?.primary
                  }}
                />
              )}
            />
          </Box>

          <OffliButton
            type="submit"
            data-testid="register-button"
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
