import { Box, Typography, styled } from '@mui/material';
import React from 'react';

const MainBox = styled(Box)(() => ({
  width: '95%',
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'center',
  justifyContent: 'center',
  marginTop: '5%'
}));

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
  description?: string;
}

const AdditionalDescription: React.FC<IProps> = ({ description }) => {
  return (
    <MainBox>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Additional description
      </Typography>
      <TextBox>
        <Typography variant="subtitle1">{description}</Typography>
      </TextBox>
    </MainBox>
  );
};

export default AdditionalDescription;
