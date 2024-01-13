import { Box, Typography } from '@mui/material';
import Loader from 'components/loader';
import React from 'react';
import NotificationRequest from '../../components/notification-request';
import { useNotifications } from '../../hooks/use-notifications';
import { INotificationDto } from '../../types/notifications/notification.dto';
import { useReactBasedOnNotificationType } from '../../hooks/use-react-based-on-notification-type';
import { AuthenticationContext } from '../../context/providers/authentication-provider';

const NotificationsScreen = () => {
  const { userInfo } = React.useContext(AuthenticationContext);

  const { data, isLoading } = useNotifications(userInfo?.id);
  const { reactBasedOnNotificationType } = useReactBasedOnNotificationType();

  const handleNotificationClick = React.useCallback((notification: INotificationDto) => {
    reactBasedOnNotificationType(notification);
  }, []);

  const areAnyNotifications = data?.data?.notifications && data?.data?.notifications?.length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}>
      {isLoading ? (
        <Loader />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            px: 2,
            boxSizing: 'border-box'
          }}>
          {areAnyNotifications ? (
            data?.data?.notifications?.map((notification) => (
              <NotificationRequest
                key={notification?.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))
          ) : (
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                mt: 4
                // alignItems: "center",
                // height: "100%",
              }}>
              <Typography variant="subtitle2">You have no new notifications</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NotificationsScreen;
