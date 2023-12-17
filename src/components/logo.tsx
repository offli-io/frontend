import { Box, SxProps } from '@mui/material';
import React from 'react';
import logo from '../assets/img/logo-purple.png';

interface ILogoProps {
  sx?: SxProps;
}

const Logo: React.FC<ILogoProps> = ({ sx }) => {
  return (
    <Box
      component="img"
      sx={{
        maxHeight: { xs: 120, md: 150 },
        maxWidth: { xs: 170, md: 200 },
        ...sx
      }}
      alt="logo"
      src={logo}
    />
  );
};

export default Logo;
