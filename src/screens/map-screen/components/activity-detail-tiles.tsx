import TimelapseIcon from '@mui/icons-material/Timelapse';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NearMeIcon from '@mui/icons-material/NearMe';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Typography } from '@mui/material';
import { Box, styled } from '@mui/system';
import React from 'react';

interface IProps {
  participantsNum?: string;
  durationHours?: string;
  durationMinutes?: string;
  distance?: number | null;
  price?: number | null;
}

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  flexDirection: 'column',
  padding: '10px !important',
  width: '70px'
}));

const StyledText = styled(Typography)(() => ({
  width: '70px',
  wordWrap: 'break-word',
  overflow: 'hidden',
  display: 'block',
  textOverflow: 'ellipsis',
  marginTop: 5
}));

const ActivityDetailTiles: React.FC<IProps> = ({
  participantsNum,
  durationHours,
  durationMinutes,
  distance,
  price
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'top',
        justifyContent: 'space-evenly',
        mb: 1
      }}>
      <StyledBox>
        <PeopleAltIcon sx={{ color: 'primary.main' }} />
        <StyledText align="center" variant="subtitle1">
          {participantsNum}
        </StyledText>
      </StyledBox>
      <StyledBox>
        <TimelapseIcon sx={{ color: 'primary.main' }} />
        <StyledText align="center" variant="subtitle1">
          {durationMinutes} <br />
          {durationHours}
        </StyledText>
      </StyledBox>
      {distance !== null && distance !== undefined && (
        <StyledBox>
          <NearMeIcon sx={{ color: 'primary.main' }} />
          <StyledText align="center" variant="subtitle1">
            {distance > 1000
              ? `${(distance / 1000).toFixed(0)} km \n from you`
              : `${distance} m \nfrom you`}
          </StyledText>
        </StyledBox>
      )}
      <StyledBox>
        <MonetizationOnIcon sx={{ color: 'primary.main' }} />
        <StyledText align="center" variant="subtitle1">
          {price}
        </StyledText>
      </StyledBox>
    </Box>
  );
};

export default ActivityDetailTiles;
