import { yupResolver } from '@hookform/resolvers/yup';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, IconButton, InputAdornment, Typography, useTheme } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useAppleAuthorization } from 'hooks/use-apple-authorization';
import { useFacebookAuthorization } from 'hooks/use-facebook-authorization';
import { useGoogleClientID } from 'hooks/use-google-client-id';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppleAuthCodeFromEnum } from 'types/apple/apple-auth-code-from-enum.dto';
import { FacebookAuthCodeFromEnumDto } from 'types/facebook/facebook-auth-code-from-enum.dto';
import { APPLE_CLIENT_ID, FB_CLIENT_ID, FB_STATE_PARAM } from 'utils/common-constants';
import * as yup from 'yup';
import { loginUser, loginViaGoogle } from '../../api/auth/requests';
import { AuthenticationContext } from '../../components/context/providers/authentication-provider';
import LabeledDivider from '../../components/labeled-divider';
import OffliBackButton from '../../components/offli-back-button';
import OffliButton from '../../components/offli-button';
import OffliTextField from '../../components/offli-text-field';
import { useGoogleAuthorization } from '../../hooks/use-google-authorization';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { GoogleAuthCodeFromEnumDto } from '../../types/google/google-auth-code-from-enum.dto';
export interface FormValues {
  username: string;
  password: string;
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    username: yup.string().defined().required(),
    password: yup.string().defined().required()
  });

const LoginScreenWithSocialsV2: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { setUserInfo, setStateToken, userInfo } = React.useContext(AuthenticationContext);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { data: { data: { client_id = null } = {} } = {} } = useGoogleClientID();
  const queryParameters = new URLSearchParams(window.location.search);
  const googleAuthCode = queryParameters.get('code');
  const paramsState = queryParameters.get('state');
  const paramsStateParsed = paramsState ? JSON.parse(paramsState) : null;

  const {
    // authorizationCode: googleAuthCode,
    handleGoogleAuthorization,
    isLoading: isGoogleAuthorizationLoading
  } = useGoogleAuthorization({
    from: GoogleAuthCodeFromEnumDto.LOGIN,
    omitTokenGetting: true,
    clientID: client_id
  });

  const { handleFacebookAuthorization, isLoading: isFacebookAuthorizationLoading } =
    useFacebookAuthorization({
      from: FacebookAuthCodeFromEnumDto.LOGIN,
      clientID: FB_CLIENT_ID
    });

  const { isLoading: isAppleAuthorizationLoading } = useAppleAuthorization({
    from: AppleAuthCodeFromEnum.LOGIN,
    clientID: APPLE_CLIENT_ID
  });
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      username: '',
      password: ''
    },
    resolver: yupResolver(schema()),
    mode: 'onChange'
  });

  const { isLoading: isGoogleLoginLoading, mutate: sendLoginViaGoogle } = useMutation(
    ['google-login'],
    (authorizationCode?: string) => {
      abortControllerRef.current = new AbortController();
      return loginViaGoogle(authorizationCode, abortControllerRef?.current?.signal);
    },
    {
      onSuccess: (data) => {
        setStateToken(data?.data?.token?.access_token ?? null);
        setUserInfo?.({
          id: data?.data?.user_id
        });
        localStorage.setItem('userId', String(data?.data?.user_id));
        navigate(ApplicationLocations.EXPLORE);
      },
      onError: () => {
        toast.error('Login with google failed');
      }
    }
  );
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
    if (googleAuthCode && paramsStateParsed !== FB_STATE_PARAM) {
      sendLoginViaGoogle(googleAuthCode);
    }
  }, [googleAuthCode, paramsStateParsed]);

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
          <OffliButton
            startIcon={<GoogleIcon sx={{ color: 'white', height: 12, marginRight: -1 }} />}
            onClick={handleGoogleAuthorization}
            sx={{ height: 47, mb: 1, width: '80%', borderRadius: 2, fontSize: 15 }}
            disabled={
              isLoading ||
              isGoogleAuthorizationLoading ||
              isGoogleLoginLoading ||
              !client_id ||
              isAppleAuthorizationLoading
            }>
            Sign in with Google
          </OffliButton>
          <OffliButton
            id="appleid-signin"
            data-color="black"
            data-border="true"
            data-type="sign in"
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
          {/*<div*/}
          {/*  id="appleid-signin"*/}
          {/*  data-color="black"*/}
          {/*  data-border="true"*/}
          {/*  data-type="sign in"*/}
          {/*  style={{ height: 47, marginBottom: 8 }}>*/}
          {/*  Sign in*/}
          {/*</div>*/}
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
            disabled={
              isLoading || isFacebookAuthorizationLoading || isGoogleLoginLoading || !client_id
            }>
            Sign in with Facebook
          </OffliButton>

          <LabeledDivider sx={{ my: 1 }}>
            <Typography variant="subtitle1">or</Typography>
          </LabeledDivider>
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <OffliTextField
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
              <OffliTextField
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
          isLoading={isLoading || isGoogleAuthorizationLoading || isGoogleLoginLoading}
          disabled={!formState?.isValid}>
          Login
        </OffliButton>
      </form>
    </>
  );
};

export default LoginScreenWithSocialsV2;
