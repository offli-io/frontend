import { Box, SxProps } from '@mui/material';
import { CustomizationContext } from 'components/context/providers/customization-provider';
import React from 'react';
import { ThemeOptionsEnumDto } from 'types/settings/theme-options.dto';
import offliLogoDark from '../assets/img/offli-logo-dark.svg';
import offliLogoLight from '../assets/img/offli-logo-light.png';

interface ILogoProps {
  sx?: SxProps;
}

const Logo: React.FC<ILogoProps> = ({ sx }) => {
  const { theme } = React.useContext(CustomizationContext);

  return (
    <Box
      component="img"
      sx={{
        maxHeight: { xs: 120, md: 150 },
        maxWidth: { xs: 170, md: 200 },
        ...sx
      }}
      alt="logo"
      src={theme === ThemeOptionsEnumDto.DARK ? offliLogoLight : offliLogoDark}
    />
  );
};

export default Logo;
