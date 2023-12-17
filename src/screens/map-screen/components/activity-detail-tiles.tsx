import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NearMeIcon from '@mui/icons-material/NearMe';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Typography } from '@mui/material';
import { Box, styled } from '@mui/system';
import React from 'react';

interface IProps {
  participantsNum?: string;
  dateTime?: string;
  distance?: number | null;
  price?: number | null;
}

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  margin: 5,
  padding: '10px !important',
  width: '100%'
}));

const StyledText = styled(Typography)(() => ({
  width: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  display: 'block',
  textOverflow: 'ellipsis',
  marginTop: 8
}));

const ActivityDetailTiles: React.FC<IProps> = ({ participantsNum, dateTime, distance, price }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
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
        <CalendarTodayIcon sx={{ color: 'primary.main' }} />
        <StyledText align="center" variant="subtitle1">
          {dateTime}
        </StyledText>
      </StyledBox>
      <StyledBox>
        <NearMeIcon sx={{ color: 'primary.main' }} />
        <StyledText align="center" variant="subtitle1">
          {distance ? `${distance} km` : '-'}
        </StyledText>
      </StyledBox>
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
