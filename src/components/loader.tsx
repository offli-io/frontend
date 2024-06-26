import { Box, CircularProgress, CircularProgressProps, SxProps } from '@mui/material';
import React from 'react';

interface ILoaderProps extends CircularProgressProps {
  containerSx?: SxProps;
}

const Loader: React.FC<ILoaderProps> = ({ containerSx, ...rest }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        my: 2,
        ...containerSx
      }}>
      <CircularProgress size={30} {...rest} />
    </Box>
  );
};
export default Loader;
