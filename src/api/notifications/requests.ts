import axios from "axios";
import { DEFAULT_DEV_URL } from "../../assets/config";
import { INotificationDto } from "../../types/notifications/notification.dto";
import { INotificationsResponse } from "../../types/notifications/notifications-response.dto";

export const getNotifications = (userId: string) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<INotificationsResponse>(
    `${DEFAULT_DEV_URL}/notifications`,
    {
      cancelToken: source?.token,
      params: {
        user_id: userId,
      },
    }
  );
  return promise;
};

export const markNotificationAsSeen = (notificationId: string) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch<INotificationsResponse>(
    `${DEFAULT_DEV_URL}/notifications/${notificationId}`,
    { seen: true },
    {
      cancelToken: source?.token,
    }
  );
  return promise;
};
