import axios from 'axios';
import { INotificationsResponse } from '../../types/notifications/notifications-response.dto';
import { WEBPUSH_VAPID_PUBLIC_KEY } from 'utils/common-constants';
import { ISubscriptionDeviceDto } from '../../types/notifications/subscription.dto';

export const getNotifications = (userId: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<INotificationsResponse>(`/notifications`, {
    cancelToken: source?.token,
    params: {
      userId
    }
  });
  return promise;
};

export const markNotificationAsSeen = (notificationId: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.patch<INotificationsResponse>(
    `/notifications/${notificationId}`,
    { seen: true },
    {
      cancelToken: source?.token
    }
  );
  return promise;
};

export const deleteNotification = (notificationId: number, signal: AbortSignal) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.delete<void>(`/notifications/${notificationId}`, {
    cancelToken: source?.token
  });

  signal?.addEventListener('abort', () => {
    source.cancel('Query was cancelled by React Query');
  });

  return promise;
};

export const subscribeBrowserPush = async (userId: number, userAgent: string) => {
  if (!('serviceWorker' in navigator)) {
    return;
  }
  try {
    const registration = await navigator.serviceWorker.ready;
    let pushSub = await registration.pushManager.getSubscription();
    if (pushSub === null) {
      pushSub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(WEBPUSH_VAPID_PUBLIC_KEY)
      });
    }

    const pushSubJson = pushSub?.toJSON();
    const device: ISubscriptionDeviceDto = {
      name: userAgent,
      endpoint: `${pushSubJson?.endpoint}`,
      auth: `${pushSubJson?.keys?.auth}`,
      p256dh: `${pushSubJson?.keys?.p256dh}`
    };

    await putSubscriptionDevice(userId, device);
  } catch (err) {
    console.error(err);
  }
};

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData.split('').map((char) => char.charCodeAt(0)));
};

// TODO: Handle exceptions within all API call functions below

// const getSubscription = async (userId: number): Promise<ISubscriptionDto> => {
//   const url = `/notifications/subscriptions`;
//   const response = await axios.get<ISubscriptionDto>(url, { params: { userId: userId } });
//   return response?.data;
// };
//
// const putSubscription = async (subscription: ISubscriptionDto) => {
//   const url = `/notifications/subscriptions`;
//   await axios.put(url, subscription, { params: { userId: subscription.user_id } });
// };

const putSubscriptionDevice = async (userId: number, subscription: ISubscriptionDeviceDto) => {
  const url = `/notifications/subscriptions/devices`;
  await axios.put(url, subscription, { params: { userId: userId } });
};

// const removeSubscriptionDevice = async (userId: number, deviceId: number) => {
//   const url = `/notifications/subscriptions/devices/${deviceId}`;
//   await axios.delete(url, { params: { userId: userId } });
// };
