import { Box, Typography, useTheme } from '@mui/material';
import { differenceInHours } from 'date-fns';
import React from 'react';
import { useGetApiUrl } from '../hooks/use-get-api-url';
import {
  INotificationDto,
  getNotificationBody,
  getNotificationPicture,
  getNotificationTitle
} from '../types/notifications/notification.dto';
import SanitizedText from './sanitized-text/sanitized-text';

interface INotificationRequestProps {
  notification: INotificationDto;
  onClick: (notifcation: INotificationDto) => void;
}

const NotificationRequest: React.FC<INotificationRequestProps> = ({ notification, onClick }) => {
  const { shadows } = useTheme();
  const baseUrl = useGetApiUrl();

  const roundDaysIfNecessarry = React.useCallback((hours: number) => {
    if (hours === 1) return `${hours} hour`;
    if (hours > 24 && hours < 48) return `${Math.floor(hours / 24)} day`;

    if (hours >= 168 && hours < 332) {
      return '1 week';
    }

    if (hours >= 332) {
      return '2 weeks';
    }

    return hours > 24 ? `${Math.floor(hours / 24)} days` : `${hours} hours`;
  }, []);

  const hourDifference = React.useCallback(() => {
    if (notification?.timestamp) {
      const unixDate = new Date(notification.timestamp * 1000);
      const hourDifference = differenceInHours(new Date(), unixDate);
      return hourDifference >= 1 ? roundDaysIfNecessarry(hourDifference) : 'just now';
    }
    return undefined;
  }, [notification?.timestamp]);

  const generateNotificationType = React.useCallback(() => {
    return getNotificationTitle(notification);
  }, [notification]);

  const generateNotificationMessage = React.useCallback(() => {
    return getNotificationBody(notification, true);
  }, [notification]);

  return (
    <>
      <Box
        onClick={() => onClick(notification)}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          textTransform: 'none',
          width: '100%'
        }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            overflow: 'hidden'
          }}>
          <Box
            sx={{
              flexGrow: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!notification?.seen ? (
                <Box
                  sx={{
                    backgroundColor: ({ palette }) => palette.primary.main,
                    height: 8,
                    minWidth: 8,
                    borderRadius: 5,
                    mr: 1
                  }}
                />
              ) : null}

              <img
                style={{
                  height: 40,
                  aspectRatio: 1,
                  borderRadius: '50%',
                  margin: 2,
                  objectFit: 'cover',
                  boxShadow: shadows[2]
                }}
                src={`${baseUrl}/files/${getNotificationPicture(notification)}`}
                alt="profile"
              />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontWeight: notification?.seen ? 'normal' : 'bold',
                    fontSize: 'h5',
                    ml: 2
                  }}>
                  {generateNotificationType()}
                </Typography>
                <Typography
                  sx={{
                    ml: 2,
                    overflowWrap: 'anywhere',
                    fontWeight: notification?.seen ? 'normal' : 'bold'
                  }}
                  variant="subtitle1">
                  <SanitizedText
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: 230
                    }}
                    text={generateNotificationMessage()}
                  />
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
            <Typography
              sx={{
                // ml: 2,
                color: (theme) => theme.palette.inactiveFont.main,
                fontSize: '0.8rem',
                textAlign: 'center',
                minWidth: 60
              }}>
              {hourDifference()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default NotificationRequest;
