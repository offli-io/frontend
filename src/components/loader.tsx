import { Box, CircularProgress, SxProps } from '@mui/material';
import React from 'react';

interface ILoaderProps {
  containerSx?: SxProps;
}

const Loader: React.FC<ILoaderProps> = ({ containerSx }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        my: 2,
        ...containerSx
      }}>
      <CircularProgress size={30} />
    </Box>
  );
};
export default Loader;
