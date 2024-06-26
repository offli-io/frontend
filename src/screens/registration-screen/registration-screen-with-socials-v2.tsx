import { yupResolver } from '@hookform/resolvers/yup';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
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
import { useAppleAuthorization } from 'hooks/auth/use-apple-authorization';
import { useFacebookAuthorization } from 'hooks/auth/use-facebook-authorization';
import { useGoogleClientID } from 'hooks/auth/use-google-client-id';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppleAuthCodeFromEnum } from 'types/apple/apple-auth-code-from-enum.dto';
import { PickUsernameTypeEnum } from 'types/common/pick-username-type-enum.dto';
import { FacebookAuthCodeFromEnumDto } from 'types/facebook/facebook-auth-code-from-enum.dto';
import {
  APPLE_CLIENT_ID,
  FB_CLIENT_ID,
  FB_STATE_PARAM,
  PRIVACY_POLICY_LINK
} from 'utils/common-constants';
import * as yup from 'yup';
import { checkIfEmailAlreadyTaken } from '../../api/users/requests';
import LabeledDivider from '../../components/labeled-divider';
import OffliBackButton from '../../components/offli-back-button';
import OffliButton from '../../components/offli-button';
import OffliTextField from '../../components/offli-text-field';
import { useGoogleAuthorization } from '../../hooks/auth/use-google-authorization';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { GoogleAuthCodeFromEnumDto } from '../../types/google/google-auth-code-from-enum.dto';
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
  const { data: { data: { client_id = null } = {} } = {} } = useGoogleClientID();

  const { authorizationCode, handleGoogleAuthorization } = useGoogleAuthorization({
    from: GoogleAuthCodeFromEnumDto.REGISTER,
    omitTokenGetting: true,
    clientID: client_id
  });

  const queryParameters = new URLSearchParams(window.location.search);
  const paramsState = queryParameters.get('state');
  const paramsStateParsed = paramsState ? JSON.parse(paramsState) : null;

  const {
    // googleToken,
    // googleAuthCode,
    handleFacebookAuthorization
    // isLoading: isGoogleAuthorizationLoading
  } = useFacebookAuthorization({
    from: FacebookAuthCodeFromEnumDto.REGISTER,
    clientID: FB_CLIENT_ID,
    registrationFlow: true
  });

  const {
    // googleToken,
    // googleAuthCode,
    // handleFacebookAuthorization,
    isLoading: isAppleAuthorizationLoading
  } = useAppleAuthorization({
    from: AppleAuthCodeFromEnum.REGISTER,
    clientID: APPLE_CLIENT_ID,
    registrationFlow: true
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
      password: '',
      policiesAgree: false
    },
    resolver: yupResolver(schema()),
    mode: 'onChange'
  });

  React.useEffect(() => {
    if (authorizationCode && paramsStateParsed !== FB_STATE_PARAM) {
      queryClient.setQueryData(['google-token'], authorizationCode);
      navigate(ApplicationLocations.PICK_USERNAME, {
        state: {
          type: PickUsernameTypeEnum.GOOGLE
        }
      });
    }
  }, [authorizationCode, paramsStateParsed]);

  React.useEffect(() => {
    // coming from FB AUTH
    if (authorizationCode && paramsStateParsed == FB_STATE_PARAM) {
      queryClient.setQueryData(['facebook-auth-code'], authorizationCode);
      navigate(ApplicationLocations.PICK_USERNAME, {
        state: {
          type: PickUsernameTypeEnum.FACEBOOK
        }
      });
    }
  }, [authorizationCode, paramsStateParsed]);

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
            //   justifyContent: 'center',
          }}>
          {/* <Typography
            variant="h1"
            gutterBottom
            sx={{
              my: 2,
              display: 'flex',
              color: ({ palette }) => palette?.text?.primary
            }}>
            Your offline life.
          </Typography> */}

          <OffliButton
            startIcon={<GoogleIcon sx={{ color: 'white', height: 12, marginRight: -1 }} />}
            onClick={handleGoogleAuthorization}
            disabled={!client_id}
            sx={{ mb: 1, mt: 2, width: '80%', borderRadius: 2, fontSize: 15 }}>
            Sign up with Google
          </OffliButton>

          {/*<div*/}
          {/*  id="appleid-signin"*/}
          {/*  data-color="black"*/}
          {/*  data-border="true"*/}
          {/*  data-type="sign in"*/}
          {/*  style={{ height: 47, marginBottom: 8, width: '80%' }}*/}
          {/*  aria-disabled={isAppleAuthorizationLoading}>*/}
          {/*  Sign in*/}
          {/*</div>*/}
          <OffliButton
            id="appleid-signin"
            data-color="black"
            data-border="true"
            data-type="sign in"
            aria-disabled={isAppleAuthorizationLoading}
            sx={{
              height: 47,
              marginBottom: 1,
              width: '80%',
              borderRadius: 2,
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: 'black'
              }
            }}>
            Sign in
          </OffliButton>

          <OffliButton
            startIcon={<FacebookIcon sx={{ color: 'white', height: 12, marginRight: -1 }} />}
            onClick={handleFacebookAuthorization}
            sx={{
              height: 47,
              mb: 1,
              width: '80%',
              bgcolor: palette?.facebook?.main,
              borderRadius: 2,
              fontSize: 15
            }}
            // disabled={
            //   isLoading || isGoogleAuthorizationLoading || isGoogleLoginLoading || !client_id
            // }>
          >
            Sign up with Facebook
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
