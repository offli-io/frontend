import axios from "axios";
import { DEFAULT_DEV_URL } from "../../assets/config";
import { INotificationsResponse } from "../../types/notifications/notifications-response.dto";

export const getNotifications = (userId: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<INotificationsResponse>(
    `${DEFAULT_DEV_URL}/notifications`,
    {
      cancelToken: source?.token,
      params: {
        userId,
      },
    }
  );
  return promise;
};

export const markNotificationAsSeen = (notificationId: number) => {
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

export const deleteNotification = (
  notificationId: number,
  signal: AbortSignal
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.delete<void>(
    `${DEFAULT_DEV_URL}/notifications/${notificationId}`,
    {
      cancelToken: source?.token,
    }
  );

  signal?.addEventListener("abort", () => {
    source.cancel("Query was cancelled by React Query");
  });

  return promise;
};
