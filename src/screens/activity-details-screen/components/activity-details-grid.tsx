import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RoomIcon from '@mui/icons-material/Room';
import { Box, Card, IconButton, Typography, styled } from '@mui/material';
import { AuthenticationContext } from 'context/providers/authentication-provider';
import { format, isAfter } from 'date-fns';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import OffliButton from '../../../components/offli-button';
import { IActivity } from '../../../types/activities/activity.dto';
import { ApplicationLocations } from '../../../types/common/applications-locations.dto';
import { DATE_TIME_FORMAT } from '../../../utils/common-constants';

export enum IGridAction {
  GOOGLE_CALENDAR = 'GOOGLE_CALENDAR'
}

interface IProps {
  activity?: IActivity;
  onActionClick?: (action: IGridAction) => void;
}

const StyledBox = styled(Card)(() => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  borderRadius: '12px',
  paddingTop: '5%',
  paddingBottom: '5%',
  marginBottom: '16px',
  borderStyle: 'solid',
  borderWidth: 1
}));

const StyledText = styled(Typography)(() => ({
  display: 'block',
  width: '90%',
  textOverflow: 'ellipsis',
  wordWrap: 'break-word',
  overflow: 'hidden',
  maxHeight: '1.4rem',
  lineHeight: '1.4rem'
}));

const ActivityDetailsGrid: React.FC<IProps> = ({ activity, onActionClick }) => {
  const { stateToken } = React.useContext(AuthenticationContext);
  const navigate = useNavigate();
  const isPastActivity =
    !!activity?.datetime_until && isAfter(new Date(), new Date(activity.datetime_until));

  const isAuthorizedUser = !!stateToken;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridAutoFlow: 'row',
        rowGap: 0.5,
        columnGap: 2,
        ml: 0.2,
        mt: 2
      }}>
      <StyledBox sx={{ borderColor: 'primary.light' }}>
        <IconButton color="primary" sx={{ p: 0 }}>
          <PeopleAltIcon sx={{ fontSize: 26, color: 'primary.main' }} />
        </IconButton>
        <OffliButton
          onClick={() => navigate(`${ApplicationLocations.ACTIVITY_MEMBERS}/${activity?.id}`)}
          variant="text"
          size="small"
          sx={{
            textDecoration: 'none',
            fontSize: 16,
            mt: 0.5
          }}
          disabled={!isAuthorizedUser}>
          Show participants
        </OffliButton>
        <StyledText align="center" variant="subtitle1">
          {activity?.count_confirmed}/{activity?.limit}
        </StyledText>
      </StyledBox>
      <StyledBox sx={{ borderColor: 'primary.light' }}>
        <IconButton color="primary" sx={{ p: 0 }}>
          <CalendarTodayIcon sx={{ fontSize: 26, color: 'primary.main' }} />
        </IconButton>

        <OffliButton
          onClick={() => onActionClick?.(IGridAction.GOOGLE_CALENDAR)}
          variant="text"
          size="small"
          sx={{
            textDecoration: 'none',
            fontSize: 15,
            mt: 0.5
          }}
          disabled={isPastActivity}>
          Add to calendar
        </OffliButton>

        <StyledText align="center" variant="subtitle1">
          {activity?.datetime_from
            ? format(new Date(activity?.datetime_from), DATE_TIME_FORMAT)
            : '-'}
        </StyledText>
      </StyledBox>
      <StyledBox sx={{ borderColor: 'primary.light' }}>
        <IconButton color="primary" sx={{ p: 0 }}>
          <RoomIcon sx={{ fontSize: 26, color: 'primary.main' }} />
        </IconButton>

        <OffliButton
          onClick={() =>
            window.open(
              `https://www.google.com/maps?q=${activity?.location?.coordinates?.lat},${activity?.location?.coordinates?.lon}`
            )
          }
          size="small"
          variant="text"
          sx={{
            textDecoration: 'none',
            fontSize: 15,
            mt: 0.5
          }}>
          Get directions
        </OffliButton>
        <StyledText align="center" variant="subtitle1">
          {activity?.location?.name}
        </StyledText>
      </StyledBox>
      <StyledBox sx={{ borderColor: 'primary.light' }}>
        <IconButton color="primary" sx={{ p: 0 }}>
          <MonetizationOnIcon sx={{ fontSize: 26, color: 'primary.main' }} />
        </IconButton>
        <OffliButton
          onClick={() => console.log('show on map')}
          variant="text"
          size="small"
          sx={{
            textDecoration: 'none',
            fontSize: 15,
            mt: 0.5
          }}>
          Initial price
        </OffliButton>
        <StyledText align="center" variant="subtitle1">
          {activity?.price ? `${activity?.price}€` : 'free'}
        </StyledText>
      </StyledBox>
    </Box>
  );
};

export default ActivityDetailsGrid;
