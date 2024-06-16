import React from 'react';
import { Box, Typography } from '@mui/material';
import Logo from '../components/logo';
import authenticationMethod from '../assets/img/authentication-method.svg';
import OffliButton from '../components/offli-button';
import { ApplicationLocations } from '../types/common/applications-locations.dto';
import { useNavigate } from 'react-router-dom';

const AuthenticationMethodScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly'
      }}>
      <Logo />
      <img src={authenticationMethod} alt="authentication method" style={{ height: '30%' }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center'
        }}>
        <OffliButton
          data-testid="login-button"
          sx={{ width: '80%', mb: 2 }}
          onClick={() => navigate(ApplicationLocations.LOGIN)}>
          Login
        </OffliButton>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography>Are you new?</Typography>
          <OffliButton
            data-testid="join-now-button"
            color="primary"
            variant="text"
            sx={{ fontSize: '1rem' }}
            onClick={() => navigate(ApplicationLocations.REGISTER)}>
            Join now!
          </OffliButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthenticationMethodScreen;
