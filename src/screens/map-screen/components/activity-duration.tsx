import { Box, Typography, styled } from '@mui/material';
import React from 'react';

const TextBox = styled(Box)(() => ({
  maxWidth: '90%',
  lineHeight: 1,
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'flex-start',
  marginLeft: '1%',
  marginTop: '1%'
}));

interface IProps {
  duration?: string;
}

const ActivityDuration: React.FC<IProps> = ({ duration }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
      <Typography variant="h4" align="left">
        Duration
      </Typography>
      <TextBox>
        <Typography variant="subtitle1">{duration}</Typography>
      </TextBox>
    </Box>
  );
};

export default ActivityDuration;
