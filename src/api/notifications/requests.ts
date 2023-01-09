import axios from 'axios'
import { DEFAULT_DEV_URL } from '../../assets/config'
import { INotificationDto } from '../../types/notifications/notification.dto'
import { INotificationsResponse } from '../../types/notifications/notifications-response.dto'

export const getNotifications = (userId: string) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.get<INotificationsResponse>(
    `${DEFAULT_DEV_URL}/notifications`,
    {
      cancelToken: source?.token,
      params: {
        user_id: userId,
      },
    }
  )
  return promise
}

export const markNotificationAsSeen = (notification: INotificationDto) => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.put<INotificationsResponse>(
    `${DEFAULT_DEV_URL}/notifications/${notification?.id}`,
    notification,
    {
      cancelToken: source?.token,
    }
  )
  return promise
}
