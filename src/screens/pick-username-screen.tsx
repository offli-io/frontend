import { yupResolver } from '@hookform/resolvers/yup';
import { Box, TextField, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { registerViaGoogle } from 'api/auth/requests';
import { AuthenticationContext } from 'context/providers/authentication-provider';
import { useFacebookAuthorization } from 'hooks/use-facebook-authorization';
import { useGetApiUrl } from 'hooks/use-get-api-url';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PickUsernameTypeEnum } from 'types/common/pick-username-type-enum.dto';
import { FacebookAuthCodeFromEnumDto } from 'types/facebook/facebook-auth-code-from-enum.dto';
import { IGoogleRegisterUserValuesDto } from 'types/google/google-register-user-values.dto';
import { useDebounce } from 'use-debounce';
import { FB_CLIENT_ID } from 'utils/common-constants';
import * as yup from 'yup';
import { checkIfUsernameAlreadyTaken, preCreateUser } from '../api/users/requests';
import OffliBackButton from '../components/offli-back-button';
import OffliButton from '../components/offli-button';
import { ApplicationLocations } from '../types/common/applications-locations.dto';
import { IEmailPassword, IEmailUsernamePassword, IUsername } from '../types/users/user.dto';

const schema: () => yup.SchemaOf<IUsername> = () =>
  yup.object({
    username: yup.string().defined().required('Please enter your username')
  });

const PickUsernameScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const type = (location?.state as { type?: PickUsernameTypeEnum })?.type;
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const { setUserInfo, setStateToken } = React.useContext(AuthenticationContext);

  const { control, handleSubmit, setError, formState, watch } = useForm<IUsername>({
    defaultValues: {
      username: ''
    },
    resolver: yupResolver(schema()),
    mode: 'onChange'
  });
  const baseUrl = useGetApiUrl();

  const queryClient = useQueryClient();

  const [queryString] = useDebounce(watch('username'), 250);

  const { data: usernameAlreadyTaken } = useQuery<any>(
    ['username-taken', queryString],
    () => checkIfUsernameAlreadyTaken(queryString),
    {
      enabled: !!queryString
    }
  );

  const {
    // googleToken,
    // googleAuthCode,
    registerViaFacebook
    // isLoading: isGoogleAuthorizationLoading
  } = useFacebookAuthorization({
    from: FacebookAuthCodeFromEnumDto.REGISTER,
    clientID: FB_CLIENT_ID,
    registrationFlow: true
  });

  const isUsernameInUse = Object.keys(formState?.errors)?.length !== 0;

  const { mutate: sendPresignupUser, isLoading } = useMutation(
    ['pre-created-user'],
    (values: IEmailUsernamePassword) => preCreateUser(values),
    {
      onSuccess: () => {
        navigate(ApplicationLocations.VERIFY);
      },
      onError: () => {
        toast.error('Failed to pre-signup');
      }
    }
  );

  const { mutate: sendRegisterViaGoogle } = useMutation(
    ['google-registration'],
    (values: IGoogleRegisterUserValuesDto) => {
      abortControllerRef.current = new AbortController();
      return registerViaGoogle(values, abortControllerRef?.current?.signal);
    },
    {
      onSuccess: (data) => {
        toast.success('Your account has been successfully registered');
        setStateToken(data?.data?.token?.access_token ?? null);
        !!setUserInfo && setUserInfo({ id: data?.data?.user_id });
        data?.data?.user_id && localStorage.setItem('userId', String(data?.data?.user_id));
        navigate(ApplicationLocations.EXPLORE);
      },
      onError: () => {
        toast.error('Registration with google failed');
      }
    }
  );

  const handleFormSubmit = React.useCallback(
    (values: IUsername) => {
      queryClient.setQueryData(['registration-username'], values);

      const registrationEmailPassword = queryClient.getQueryData<IEmailPassword>([
        'registration-email-password'
      ]);

      const baseUrlEnvironmentDependent = window.location.href.split('/').slice(0, -1).join('/');

      if (type === PickUsernameTypeEnum.GOOGLE) {
        const authCode = queryClient.getQueryData<string | undefined>(['google-token']);
        sendRegisterViaGoogle({
          googleBearerToken: '',
          username: values?.username,
          auth_code: authCode,
          redirect_uri: `${baseUrlEnvironmentDependent}/register`
        });
      }

      if (type === PickUsernameTypeEnum.FACEBOOK) {
        const authCode = queryClient.getQueryData<string | undefined>(['facebook-auth-code']);
        registerViaFacebook({
          username: values?.username,
          auth_code: String(authCode),
          redirect_uri: `${baseUrlEnvironmentDependent}/register`
        });
      } else {
        sendPresignupUser({
          email: registrationEmailPassword?.email,
          username: values?.username,
          password: registrationEmailPassword?.password
        });
      }
    },
    [sendRegisterViaGoogle, sendPresignupUser, baseUrl]
  );

  React.useEffect(() => {
    if (usernameAlreadyTaken?.data) {
      setError('username', { message: 'Username already in use' });
    }
  }, [usernameAlreadyTaken]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ height: '100%' }}>
      <OffliBackButton
        onClick={() => navigate(ApplicationLocations.REGISTER)}
        sx={{ alignSelf: 'flex-start', m: 1 }}>
        Registration
      </OffliBackButton>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <Typography variant="h2" align="left" sx={{ width: '75%', mt: 15 }}>
          <Box sx={{ color: 'primary.main', width: '85%' }}>Choose&nbsp;</Box>
          your username
        </Typography>
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              placeholder="Username"
              error={!!error}
              helperText={error?.message}
              sx={{ width: '80%', mt: 4, mb: 8 }}
            />
          )}
        />
        <OffliButton
          variant="contained"
          type="submit"
          sx={{ width: '80%', mb: 5 }}
          disabled={isUsernameInUse}
          isLoading={isLoading}>
          {type === PickUsernameTypeEnum.GOOGLE ? 'Register' : 'Next'}
        </OffliButton>
      </Box>
    </form>
  );
};

export default PickUsernameScreen;
