import axios from "axios";
import { DEFAULT_DEV_URL } from "../../assets/config";
import { INotificationsResponse } from "../../types/notifications/notifications-response.dto";
import { WEBPUSH_VAPID_PUBLIC_KEY } from "utils/common-constants";

export const getNotifications = (userId: number) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get<INotificationsResponse>(`/notifications`, {
    cancelToken: source?.token,
    params: {
      userId,
    },
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

  const promise = axios.delete<void>(`/notifications/${notificationId}`, {
    cancelToken: source?.token,
  });

  signal?.addEventListener("abort", () => {
    source.cancel("Query was cancelled by React Query");
  });

  return promise;
};

export async function subscribeBrowserPush(userId: number) {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  try {
    let registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (subscription === null) {
      // TODO: VAPID Public Key from ENV
      let vapidPublicKey = WEBPUSH_VAPID_PUBLIC_KEY;
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
    }
    // TODO: Check whether the user is already subscribed within Offli, if so and the endpoint is the same, do not
    //  perform putSubscription
    // axios.get(`/notifications/subscriptions`, {params: userId})
    await putSubscription(subscription, userId); // TODO: ID of current user
  } catch (err) {
    console.error(err);
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData.split("").map((char) => char.charCodeAt(0)));
}

async function putSubscription(subscription: PushSubscription, userId: number) {
  let sub = subscription.toJSON();
  console.log(subscription.toJSON()); // TODO: Remove logging
  let url = `/notifications/subscriptions`;
  let data = {
    endpoint: sub.endpoint,
    auth: sub.keys?.auth,
    p256dh: sub.keys?.p256dh,
  };
  await axios.put(url, data, { params: { userId: userId } });
}
