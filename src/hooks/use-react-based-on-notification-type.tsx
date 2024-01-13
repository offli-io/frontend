import React from 'react';
import { UseMutateFunction, useMutation, useQueryClient } from '@tanstack/react-query';
import { INotificationDto } from 'types/notifications/notification.dto';
import { markNotificationAsSeen } from 'api/notifications/requests';
import { toast } from 'sonner';
import { NotificationTypeEnum } from 'types/notifications/notification-type-enum';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { ApplicationLocations } from 'types/common/applications-locations.dto';
import { DrawerContext, IDrawerData } from 'assets/theme/drawer-provider';
import FeedbackDrawer from '../screens/notifications-screen/components/feedback-drawer';
import { ICreatorFeedback } from 'types/users/user-feedback.dto';
import { AxiosResponse } from 'axios';
import { sendUserFeedback } from '../api/users/requests';

const reactAfter = (
  notification: INotificationDto,
  navigate: NavigateFunction,
  toggleDrawer: (drawerData: IDrawerData) => void,
  sendFeedbackOnCreator: UseMutateFunction<
    AxiosResponse<void, any>,
    unknown,
    ICreatorFeedback,
    unknown
  >
) => {
  const notificationId = notification.id;

  if (notification?.type === NotificationTypeEnum.ACTIVITY_INV) {
    navigate(`${ApplicationLocations.EXPLORE}/request/${notification?.properties?.activity?.id}`, {
      state: {
        from: '/notifications',
        notificationId
      }
    });
  } else if (notification?.type === NotificationTypeEnum.BUDDY_REQ) {
    navigate(`${ApplicationLocations.PROFILE}/request/${notification?.properties?.user?.id}`, {
      state: {
        from: '/notifications',
        notificationId
      }
    });
  } else if (notification?.type === NotificationTypeEnum.ACTIVITY_CHANGE) {
    if (
      notification?.properties?.changes?.[0]?.old === 'ongoing' &&
      notification?.properties?.changes?.[0]?.new === 'completed'
    ) {
      // feedback request
      const user = notification?.properties?.user;
      const activity = notification?.properties?.activity;

      toggleDrawer({
        open: true,
        content: (
          <FeedbackDrawer
            creator={user}
            activity={activity}
            onFeedbackButtonClick={(value) =>
              sendFeedbackOnCreator({
                activity_id: activity?.id,
                user_id: user?.id,
                feedback_value: value
              })
            }
          />
        )
      });
    } else {
      // probably just one case - activity cancelled
      navigate(
        `${ApplicationLocations.EXPLORE}/request/${notification?.properties?.activity?.id}`,
        {
          state: {
            from: '/notifications',
            notificationId
          }
        }
      );
    }
  }
};

export const useReactBasedOnNotificationType = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toggleDrawer } = React.useContext(DrawerContext);

  // const abortControllerRef = React.useRef<AbortController | null>(null);

  const { mutate: sendMarkNotification } = useMutation(
    ['mark-notification'],
    (notification: INotificationDto) => markNotificationAsSeen(notification?.id),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['notifications']);
        reactAfter(variables, navigate, toggleDrawer, sendFeedbackOnCreator);
      },
      onError: () => {
        toast.error('Failed to load notification detail');
      }
    }
  );

  const { mutate: sendFeedbackOnCreator } = useMutation(
    ['user-feedback'],
    (values: ICreatorFeedback) => sendUserFeedback(values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
        toggleDrawer({
          open: false
        });
      },
      onError: () => {
        toast.error('Failed to load notification detail');
      }
    }
  );

  const reactBasedOnNotificationType = (notification: INotificationDto) => {
    if (notification?.seen) reactAfter(notification, navigate, toggleDrawer, sendFeedbackOnCreator);
    else {
      sendMarkNotification(notification);
    }
  };

  return { reactBasedOnNotificationType };
};
