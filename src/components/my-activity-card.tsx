import { Box, SxProps, Typography } from '@mui/material';
import { useGetApiUrl } from 'hooks/use-get-api-url';
import React from 'react';
import useLongPress from '../hooks/use-long-press';
import { IActivity } from '../types/activities/activity.dto';
import OffliButton from './offli-button';

interface IMyActivityCardProps {
  activity?: IActivity;
  // onLongPress: (activityId: string) => void;
  onPress?: (activity?: IActivity) => void;
  onLongPress?: (activity?: IActivity) => void;
  sx?: SxProps;
  type: string;
}

const MyActivityCard: React.FC<IMyActivityCardProps> = ({
  activity,
  onPress,
  onLongPress,
  type,
  ...rest
}) => {
  //TODO maybe in later use also need some refactoring
  const { handlers } = useLongPress({
    onLongPress: () => onLongPress?.(activity)
  });
  const baseUrl = useGetApiUrl();

  const currentTime = new Date();

  const isOngoing =
    activity?.datetime_from &&
    activity?.datetime_until &&
    currentTime >= new Date(activity.datetime_from) &&
    currentTime <= new Date(activity.datetime_until);

  let startDateTime: Date | undefined = undefined;
  let timeRemainingHours: number = 0;
  let timeRemainingMinutes: number = 0;
  let timeRemainingDays: number = 0;

  if (activity?.datetime_from) {
    startDateTime = new Date(activity.datetime_from);
    timeRemainingHours = Math.floor(
      (startDateTime.valueOf() - currentTime.valueOf()) / (1000 * 60 * 60)
    );
    timeRemainingMinutes = Math.floor(
      ((startDateTime.valueOf() - currentTime.valueOf()) / (1000 * 60)) % 60
    );
    timeRemainingDays = Math.floor(timeRemainingHours / 24);
  }

  let timeRemainingText;

  if (timeRemainingDays >= 1) {
    timeRemainingText = timeRemainingDays === 1 ? 'in 1 day' : `in ${timeRemainingDays} days`;
  } else if (timeRemainingHours >= 1) {
    timeRemainingText = timeRemainingHours === 1 ? 'in 1 hour' : `in ${timeRemainingHours} hours`;
  } else {
    timeRemainingText =
      timeRemainingMinutes === 1 ? 'less than a minute' : `in ${timeRemainingMinutes} minutes`;
  }

  return (
    <OffliButton
      sx={{
        display: 'flex',
        width: 280,
        minWidth: 280,
        // background:
        //   'linear-gradient(90deg, rgba(74, 20, 140, 0.18) 0%, rgba(74, 20, 140, 0.18) 44.06%, rgba(255, 255, 255, 0.00) 90.95%)',
        bgcolor: 'primary.light',
        m: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        pl: 0.5
      }}
      color="inherit"
      {...handlers}
      onClick={() => onPress?.(activity)}
      data-testid="my-activitiy-card"
      {...rest}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}>
        <Box sx={{ height: 75, width: 90 }}>
          <img
            src={`${baseUrl}/files/${activity?.title_picture}`}
            alt="activity_picture"
            style={{ height: 75, borderRadius: '10px' }}
          />
        </Box>
        {type === 'explore' && (
          <Box
            sx={{
              width: 170,
              ml: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              textAlign: 'left'
            }}>
            <Typography
              variant="h5"
              sx={{
                width: 160,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
              {activity?.title ?? 'Title'}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                width: 160,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
              {activity?.location?.name ?? 'Location'}
            </Typography>
            {isOngoing ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    backgroundColor: ({ palette }) => palette.primary.main,
                    height: 10,
                    minWidth: 10,
                    borderRadius: 5,
                    mr: 1
                  }}
                />
                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                  Activity in progress
                </Typography>
              </Box>
            ) : (
              <Typography variant="subtitle1">{timeRemainingText}</Typography>
            )}
          </Box>
        )}
        {type === 'profile' && (
          <Box
            sx={{
              width: 170,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              textAlign: 'left',
              ml: 2
            }}>
            <Typography
              variant="h5"
              sx={{
                color: ({ palette }) => palette?.primary?.main,
                width: 160,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
              {activity?.title ?? 'Title'}
            </Typography>
          </Box>
        )}
      </Box>
    </OffliButton>
  );
};

export default MyActivityCard;
