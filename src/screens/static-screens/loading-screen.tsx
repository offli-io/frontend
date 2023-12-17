import { Box } from '@mui/material';
import offliLogo from '../../assets/img/logo-purple.png';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      // className="backgroundImage"
      onTouchStart={(e) => console.log(e)}>
      <img src={offliLogo} alt="Offli logo" style={{ height: '80px', marginTop: '-50px' }} />
    </Box>
  );
};

export default LoadingScreen;
