import { Box, SxProps, Typography } from '@mui/material';
import { useGetApiUrl } from 'hooks/utils/use-get-api-url';
import React from 'react';
import useLongPress from '../hooks/utils/use-long-press';
import { IActivity } from '../types/activities/activity.dto';
import OffliButton from './offli-button';

interface IMyActivityCardProps {
  activity?: IActivity;
  // onLongPress: (activityId: string) => void;
  onPress?: (activity?: IActivity) => void;
  onLongPress?: (activity?: IActivity) => void;
  sx?: SxProps;
}

const MyActivityCard: React.FC<IMyActivityCardProps> = ({
  activity,
  onPress,
  onLongPress,
  ...rest
}) => {
  //TODO maybe in later use also need some refactoring
  const { handlers } = useLongPress({
    onLongPress: () => onLongPress?.(activity)
  });
  const baseUrl = useGetApiUrl();

  return (
    <OffliButton
      sx={{
        display: 'flex',
        bgcolor: 'primary.light',
        m: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        pl: 0.5,
        minWidth: 280,
        width: '100%'
      }}
      color="inherit"
      {...handlers}
      onClick={() => onPress?.(activity)}
      data-testid="my-activity-card"
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
      </Box>
    </OffliButton>
  );
};

export default MyActivityCard;
