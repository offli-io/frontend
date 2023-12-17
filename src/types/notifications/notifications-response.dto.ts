import { INotificationDto } from './notification.dto';

export interface INotificationsResponse {
  count: number;
  unseen: number;
  notifications: INotificationDto[];
  success: boolean;
}
