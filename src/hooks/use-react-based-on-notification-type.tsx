import { useMutation, useQueryClient } from '@tanstack/react-query';
import { INotificationDto } from 'types/notifications/notification.dto';
import { markNotificationAsSeen } from 'api/notifications/requests';
import { toast } from 'sonner';
import { NotificationTypeEnum } from 'types/notifications/notification-type-enum';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { ApplicationLocations } from 'types/common/applications-locations.dto';
import { ActivityStatusEnumDto } from '../types/activities/activity-status-enum.dto';

const reactAfter = (notification: INotificationDto, navigate: NavigateFunction) => {
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
      notification?.properties?.changes?.[0]?.old === ActivityStatusEnumDto.ONGOING &&
      notification?.properties?.changes?.[0]?.new === ActivityStatusEnumDto.COMPLETED
    ) {
      // feedback request
      navigate(
        `${ApplicationLocations.EXPLORE}/request/${notification?.properties?.activity?.id}`,
        {
          state: {
            from: '/notifications',
            notificationId,
            openFeedbackDrawer: true
          }
        }
      );
    } else {
      // probably only one case - activity cancelled
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

  // const abortControllerRef = React.useRef<AbortController | null>(null);

  const { mutate: sendMarkNotification } = useMutation(
    ['mark-notification'],
    (notification: INotificationDto) => markNotificationAsSeen(notification?.id),
    {
      onSuccess: (data, variables) => {
        queryClient?.invalidateQueries(['notifications']);
        reactAfter(variables, navigate);
      },
      onError: () => {
        toast.error('Failed to load notification detail');
      }
    }
  );

  const reactBasedOnNotificationType = (notification: INotificationDto) => {
    if (notification?.seen) reactAfter(notification, navigate);
    else {
      sendMarkNotification(notification);
    }
  };

  return { reactBasedOnNotificationType };
};
