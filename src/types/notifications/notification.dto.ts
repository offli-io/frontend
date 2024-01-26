import { IActivity, IPerson } from '../activities/activity.dto';
import { NotificationTypeEnum } from './notification-type-enum';

interface INotificationChanges {
  key?: string;
  old?: string;
  new?: string;
}
export interface INotificationDto {
  id: number;
  user_id: number;
  seen: boolean;
  type: NotificationTypeEnum;
  timestamp: number;
  properties: {
    activity?: IActivity;
    user?: IPerson;
    changes?: INotificationChanges[];
    // TODO: Activity changes
  };
}

// TODO: Refactor functions below to methods?

export const getNotificationTitle = (notification: INotificationDto): string => {
  switch (notification.type) {
    case NotificationTypeEnum.ACTIVITY_INV:
      return 'Activity invitation';
    case NotificationTypeEnum.ACTIVITY_CHANGE:
      return 'Activity update';
    case NotificationTypeEnum.BUDDY_REQ:
      return 'Buddy request';
    default:
      return '';
  }
};

export const getNotificationBody = (
  notification: INotificationDto,
  htmlEnhance: boolean
): string => {
  switch (notification.type) {
    case NotificationTypeEnum.ACTIVITY_INV:
      return `${notification?.properties?.user?.username} invited you to join ${makeActivityTitle(
        notification,
        htmlEnhance
      )}`;
    case NotificationTypeEnum.ACTIVITY_CHANGE:
      return `There have been some changes in ${makeActivityTitle(notification, htmlEnhance)}`;
    case NotificationTypeEnum.BUDDY_REQ:
      return `${notification?.properties?.user?.username} sent you a buddy request`;
    default:
      return '';
  }
};

const makeActivityTitle = (notification: INotificationDto, htmlEnhance: boolean): string => {
  if (htmlEnhance) {
    return `<br><em>${notification?.properties?.activity?.title}</em>`; // TODO: Remove <br>
  }
  return `${notification?.properties?.activity?.title}`;
};

export const getNotificationPicture = (notification: INotificationDto): string => {
  switch (notification.type) {
    case NotificationTypeEnum.ACTIVITY_INV:
      return `${notification?.properties?.activity?.title_picture}`;
    case NotificationTypeEnum.ACTIVITY_CHANGE:
      return `${notification?.properties?.activity?.title_picture}`;
    case NotificationTypeEnum.BUDDY_REQ:
      return `${notification?.properties?.user?.profile_photo}`;
    default:
      return '';
  }
};
