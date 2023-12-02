import { Box, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Loader from 'components/loader';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { markNotificationAsSeen } from '../../api/notifications/requests';
import { AuthenticationContext } from '../../context/providers/authentication-provider';
import NotificationRequest from '../../components/notification-request';
import { useNotifications } from '../../hooks/use-notifications';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import { ICustomizedLocationStateDto } from '../../types/common/customized-location-state.dto';
import { NotificationTypeEnum } from '../../types/notifications/notification-type-enum';
import { INotificationDto } from '../../types/notifications/notification.dto';
import { DrawerContext } from 'assets/theme/drawer-provider';
import FeedbackDrawer from './components/feedback-drawer';
import { ICreatorFeedback } from 'types/users/user-feedback.dto';
import { useReactBasedOnNotificationType } from './utils/use-react-based-on-notification-type';

const NotificationsScreen = () => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const from = (location?.state as ICustomizedLocationStateDto)?.from;
  const { data, isLoading } = useNotifications(userInfo?.id);
  const { reactBasedOnNotificationType } = useReactBasedOnNotificationType();

  const abortControllerRef = React.useRef<AbortController | null>(null);

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
