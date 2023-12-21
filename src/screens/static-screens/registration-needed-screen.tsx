import { Box, Typography } from '@mui/material';
import LabeledDivider from 'components/labeled-divider';
import OffliButton from 'components/offli-button';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationLocations } from 'types/common/applications-locations.dto';
import registrationNeededImg from '../../assets/img/registration-needed.svg';

interface IRegistrationNeededScreenProps {}

const RegistrationNeededScreen: React.FC<IRegistrationNeededScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        boxSizing: 'border-box'
      }}>
      <Typography variant="h2" sx={{ textAlign: 'center', mb: 4 }}>
        Elevate your free time by installing the Offli app for free.
      </Typography>
      <img src={registrationNeededImg} alt="Offli logo" style={{ height: 200 }} />
      <OffliButton
        //TODO navigate to app store / google store
        // onClick={() => navigate(ApplicationLocations.REGISTER)}
        sx={{ mt: 4, width: '60%' }}>
        Download App
      </OffliButton>

      <LabeledDivider sx={{ mt: 1 }}>
        <Typography variant="subtitle1">or</Typography>
      </LabeledDivider>
      <OffliButton
        onClick={() => navigate(ApplicationLocations.REGISTER)}
        sx={{ width: '60%' }}
        variant="text">
        Sign up or Log in
      </OffliButton>
    </Box>
  );
};

export default RegistrationNeededScreen;
