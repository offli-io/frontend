import { Box, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Loader from 'components/loader';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { markNotificationAsSeen } from '../../api/notifications/requests';
import { AuthenticationContext } from '../../assets/theme/authentication-provider';
import NotificationRequest from '../../components/notification-request';
import { useNotifications } from '../../hooks/use-notifications';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { NotificationTypeEnum } from '../../types/notifications/notification-type-enum';
import { INotificationDto } from '../../types/notifications/notification.dto';

const NotificationsScreen = () => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading } = useNotifications(userInfo?.id);
  const queryClient = useQueryClient();

  const { mutate: sendMarkNotification } = useMutation(
    ['mark-notification'],
    (notification: INotificationDto) => markNotificationAsSeen(notification?.id),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['notifications']);
        navigateBasedOnType(
          variables?.type,
          variables?.type === NotificationTypeEnum.ACTIVITY_INV
            ? variables?.properties?.activity?.id
            : variables?.properties?.user?.id,
          variables?.id
        );
      },
      onError: () => {
        toast.error('Failed to load notification detail');
      }
    }
  );

  const navigateBasedOnType = React.useCallback(
    (type?: NotificationTypeEnum, id?: number, notificationId?: number) => {
      if (type === NotificationTypeEnum.ACTIVITY_INV) {
        return navigate(`${ApplicationLocations.EXPLORE}/request/${id}`, {
          state: {
            from: location?.pathname,
            notificationId
          }
        });
      }
      if (type === NotificationTypeEnum.BUDDY_REQ) {
        return navigate(`${ApplicationLocations.PROFILE}/request/${id}`, {
          state: {
            from: location?.pathname,
            notificationId
          }
        });
      }
      return;
    },
    [navigate]
  );

  const handleNotificationClick = React.useCallback((notification: INotificationDto) => {
    return notification?.seen
      ? navigateBasedOnType(
          notification?.type,
          notification?.type === NotificationTypeEnum.ACTIVITY_INV
            ? notification?.properties?.activity?.id
            : notification?.properties?.user?.id,
          notification?.id
        )
      : sendMarkNotification(notification);
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
