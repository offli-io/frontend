import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

interface IProps {
  text?: string;
  Icon?: React.ReactNode;
}

const TransparentChip: React.FC<IProps> = ({ text, Icon }) => {
  return (
    <Box
      sx={{
        width: '100%',
        // height: '10%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
      <Box
        sx={{
          // width: '10%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          borderRadius: '12px',
          backdropFilter: 'blur(2px)',
          backgroundColor: 'rgba(0,0,0,.25)',
          padding: '5%'
        }}>
        {Icon}
        <Typography
          variant="subtitle2"
          sx={{
            ml: 0.5,
            fontSize: '16px'
          }}>
          {text}
        </Typography>
      </Box>
    </Box>
  );
};

export default TransparentChip;
