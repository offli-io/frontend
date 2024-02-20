import { Box } from '@mui/material';
import React from 'react';
import BackButton from '../../components/back-button';
// import ErrorIcon from '@mui/icons-material/Error'
import { useNavigate } from 'react-router-dom';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import NewPasswordForm from './components/new-password-form';
import ResetPasswordForm from './components/reset-password-form';
import VerificationCodeForm from './components/verification-code-form';

export interface FormValues {
  password: string;
}

const ForgottenPasswordScreen = () => {
  const [email, setEmail] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);

  const generateBackButtonLabel = React.useCallback(() => {
    if (activeStep === 0) {
      return 'Login';
    }
    if (activeStep === 1) {
      return 'Email';
    }
    if (activeStep === 2) {
      return 'Code confirmation';
    }
    return '';
  }, [activeStep]);

  const handleBackClicked = React.useCallback(() => {
    if (activeStep === 0) {
      return navigate(ApplicationLocations.LOGIN);
    }
    setActiveStep((activeStep) => activeStep - 1);
  }, [activeStep, setActiveStep, navigate]);

  // console.log(JSON.parse(messages!));

  const foundArray = localStorage.getItem('rn-app');
  const parsed = foundArray ? JSON.parse(foundArray) : [];

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 4,
        // move little bit upper to have space for mobile keyboard
        pb: 10,
        boxSizing: 'border-box'
      }}>
      <BackButton
        sxOverrides={{ top: 20, left: 10 }}
        text={generateBackButtonLabel()}
        onClick={handleBackClicked}
      />

      {activeStep === 0 && (
        <div style={{ maxWidth: 300 }}>
          Logs
          <div style={{ height: 400, backgroundColor: 'lightblue' }}>
            {parsed?.map((item: any) => item?.source)}
          </div>
          <div>
            {parsed?.map((item: any, index: any) => <div key={index}>{item?.payload?.event}</div>)}
          </div>
          {/* <div>Payload :{parsed?.payload}</div> */}
          <div style={{ height: 400, backgroundColor: 'lightblue' }}>
            {parsed?.map((item: any) => (typeof item === 'object' ? 'je objekt' : item))}
          </div>
        </div>
      )}

      {activeStep === 4 && (
        <ResetPasswordForm
          onSuccess={(email: string) => {
            setEmail(email);
            setActiveStep((activeStep) => activeStep + 1);
          }}
        />
      )}
      {activeStep === 1 && (
        <VerificationCodeForm
          email={email}
          onSuccess={(code) => {
            setVerificationCode(code);
            setActiveStep((activeStep) => activeStep + 1);
          }}
        />
      )}
      {activeStep === 2 && (
        <NewPasswordForm
          email={email}
          verificationCode={verificationCode}
          onSuccess={() => navigate(ApplicationLocations.LOGIN)}
        />
      )}
    </Box>
  );
};

export default ForgottenPasswordScreen;
