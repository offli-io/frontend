import { Box } from '@mui/material';
import Logo from '../components/logo';
import OffliButton from '../components/offli-button';
import { useNavigate } from 'react-router-dom';
import { ApplicationLocations } from 'types/common/applications-locations.dto';
import backgroundImage from '../assets/img/undraw_real_life_blue.svg';

const LoginOrRegisterScreen = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden'
        //   justifyContent: 'center',
      }}>
      <Box sx={{ mt: 10, flex: 1 }}>
        <Logo />
      </Box>
      <img
        src={backgroundImage}
        alt="Background"
        style={{ height: 250, marginBottom: '20%', marginTop: '10%' }}
      />
      <OffliButton
        onClick={() => navigate(ApplicationLocations.LOGIN)}
        sx={{ width: '80%', mb: 1 }}>
        Login
      </OffliButton>
      <OffliButton
        onClick={() => navigate(ApplicationLocations.REGISTER)}
        variant="text"
        sx={{ width: '80%' }}>
        Register
      </OffliButton>
    </Box>
  );
};

export default LoginOrRegisterScreen;
