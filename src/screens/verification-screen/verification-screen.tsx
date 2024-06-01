import { Box, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Loader from 'components/loader';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginUser, resendCode } from '../../api/auth/requests';
import { verifyCodeAndRetrieveUserId } from '../../api/users/requests';
import { AuthenticationContext } from '../../components/context/providers/authentication-provider';
import OffliBackButton from '../../components/offli-back-button';
import OffliButton from '../../components/offli-button';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { IEmailPassword, IUsername } from '../../types/users/user.dto';
import OTPInput from './components/otp-input';

interface LoginValues {
  username: string;
  password: string;
}

const VerificationScreen = () => {
  const [{ otp, numInputs, placeholder, inputType }, setConfig] = React.useState({
    otp: '',
    numInputs: 6,
    placeholder: '',
    inputType: 'number' as const
  });

  const handleOTPChange = (otp: string) => {
    setConfig((prevConfig) => ({ ...prevConfig, otp }));
    if (otp?.length === numInputs) {
      // setOptDisabled(true);
      sendVerifyCode(otp);
    }
  };

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setIsFirstTimeLogin, setStateToken, setUserInfo } =
    React.useContext(AuthenticationContext);

  const precreatedEmailPassword = queryClient.getQueryData<IEmailPassword>([
    'registration-email-password'
  ]);

  const precreatedUsername = queryClient.getQueryData<IUsername>(['registration-username']);

  const { isLoading: isLoggingUser, mutate: sendLoginUser } = useMutation(
    ['login'],
    (values: LoginValues) => {
      return loginUser(values);
    },
    {
      onSuccess: (data, params) => {
        setStateToken(data?.data?.token?.access_token ?? null);
        setUserInfo?.({ username: params?.username, id: data?.data?.user_id });
        localStorage.setItem('userId', String(data?.data?.user_id));
        setIsFirstTimeLogin?.(true);
        navigate(ApplicationLocations.EXPLORE);
      },
      onError: () => {
        toast.error('Failed to log in');
      }
    }
  );
  const { mutate: sendVerifyCode, isLoading: isVerifyingCode } = useMutation(
    ['user-id'],
    (code: string) =>
      verifyCodeAndRetrieveUserId({
        email: precreatedEmailPassword?.email,
        verification_code: code
      }),
    {
      onSuccess: (data) => {
        console.log(data?.data);
        sendLoginUser({
          username: precreatedUsername?.username ?? '',
          password: precreatedEmailPassword?.password ?? ''
        });
      },
      onError: () => {
        toast.error('Entered code is not correct, please try again.');

        setConfig((prevConfig) => ({ ...prevConfig, otp: '' }));
      }
    }
  );

  const { isLoading: isResendingCode, mutate: sendResendCode } = useMutation(
    ['resend-code'],
    () => {
      return resendCode({
        email: precreatedEmailPassword?.email
      });
    },
    {
      onSuccess: () => {
        toast.success('Verification code was re-sent to your email');
      },
      onError: () => {
        toast.error('Failed to re-send verification code to given email');
      }
    }
  );

  const handleResendCode = React.useCallback(() => sendResendCode(), []);

  const isLoading = React.useMemo(
    () => isVerifyingCode || isLoggingUser,
    [isVerifyingCode, isLoggingUser]
  );

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
        //   justifyContent: 'center',
      }}>
      <OffliBackButton
        onClick={() => navigate(ApplicationLocations.REGISTER)}
        sx={{ alignSelf: 'flex-start', m: 1 }}>
        Username
      </OffliBackButton>
      <Typography variant="h2" sx={{ mt: 15, width: '75%' }} align="left">
        <Box sx={{ color: 'primary.main' }}>Confirm</Box>verification code
      </Typography>
      <Typography align="center" variant="subtitle2" sx={{ width: '75%', mt: 2, mb: 3 }}>
        Take a look for the verification code we just sent you to{' '}
        <b>{precreatedEmailPassword?.email}</b>.
      </Typography>
      {isLoading ? <Loader containerSx={{ mt: 1 }} /> : null}
      <Typography variant="subtitle2" sx={{ ml: -18, mb: 1 }}>
        Confirmation code
      </Typography>
      <OTPInput
        numInputs={numInputs}
        onChange={handleOTPChange}
        value={otp}
        placeholder={placeholder}
        inputType={inputType}
        renderInput={(props) => <input {...props} />}
        shouldAutoFocus
        otpDisabled={isLoading}
      />
      <Box sx={{ display: 'flex', mr: -15, alignItems: 'center' }}>
        <Typography variant="subtitle2">No email?</Typography>
        <OffliButton variant="text" onClick={handleResendCode} isLoading={isResendingCode}>
          <Typography variant="subtitle2" sx={{ color: 'primary.main', ml: -1 }}>
            &nbsp;<b>Resend code</b>
          </Typography>
        </OffliButton>
      </Box>
    </Box>
  );
};

export default VerificationScreen;
