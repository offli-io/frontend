import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NearMeIcon from '@mui/icons-material/NearMe';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Box, SxProps, Typography, useTheme } from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import activityPlaceholderImage from '../assets/img/activity-placeholder-image.svg';
import { useGetApiUrl } from '../hooks/use-get-api-url';
import { IActivity } from '../types/activities/activity.dto';
import { calculateDistance } from '../utils/calculate-distance.util';

interface IMyActivityCardProps {
  activity?: IActivity;
  // onLongPress: (activityId: string) => void;
  onPress: (activity?: IActivity) => void;
  sx?: SxProps;
}

const ActivitySearchCard: React.FC<IMyActivityCardProps> = ({ activity, onPress, sx, ...rest }) => {
  //TODO maybe in later use also need some refactoring
  const baseUrl = useGetApiUrl();
  const { palette, shadows } = useTheme();

  const [currentLocation, setCurrentLocation] = React.useState<
    GeolocationCoordinates | undefined
  >();

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCurrentLocation(position.coords);
    });
  }, []);

  const distance = calculateDistance(activity?.location?.coordinates, {
    lat: currentLocation?.latitude,
    lon: currentLocation?.longitude
  });

  return (
    <Box
      sx={{
        minWidth: 300,
        display: 'grid',
        gridTemplateColumns: '2fr 5fr',
        alignItems: 'center',
        // boxSizing: "border-box",
        // boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: 1,
        mb: 2,
        ...sx
      }}
      onClick={() => onPress(activity)}
      data-testid="activity-search-card"
      {...rest}>
      <Box sx={{ p: 0.5, mr: 1 }}>
        <img
          src={
            activity?.title_picture
              ? `${baseUrl}/files/${activity?.title_picture}`
              : activityPlaceholderImage
          }
          alt="activity_image"
          style={{ height: 80, borderRadius: 10, boxShadow: shadows[2] }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          overflow: 'hidden'
        }}>
        <Box sx={{ display: 'flex' }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: palette?.text?.primary
              }}>
              {activity?.title}
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                lineHeight: '1rem',
                maxHeight: '2rem',
                overflow: 'hidden',
                color: palette?.text?.primary
              }}>
              {activity?.location?.name}
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                fontSize: 12,
                lineHeight: '1rem',
                color: palette?.text?.primary
              }}>
              {format(
                (activity?.datetime_from ? new Date(activity?.datetime_from) : new Date()) as Date,
                'dd.MM.yyyy , hh:mm'
              )}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          {!!distance && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NearMeIcon sx={{ fontSize: 18, mr: 0.5, color: palette?.text?.primary }} />
              <Typography sx={{ fontSize: 12, color: palette?.text?.primary }}>
                {distance > 1
                  ? `${distance.toFixed(0)} km\nfrom you`
                  : `${(distance * 1000).toFixed(0)} m\nfrom you`}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleAltIcon sx={{ fontSize: 18, mr: 0.5, color: palette?.text?.primary }} />
            <Typography sx={{ fontSize: 12, color: palette?.text?.primary }}>
              {`${activity?.count_confirmed ?? 0}/${activity?.limit}`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MonetizationOnIcon sx={{ fontSize: 18, mr: 0.5, color: palette?.text?.primary }} />
            <Typography sx={{ fontSize: 12, color: palette?.text?.primary }}>
              {`${activity?.price}`}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ActivitySearchCard;
