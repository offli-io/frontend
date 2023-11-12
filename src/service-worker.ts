/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import {
    getNotificationBody,
    getNotificationPicture,
    getNotificationTitle,
    INotificationDto
} from "./types/notifications/notification.dto";
import {NotificationTypeEnum} from "./types/notifications/notification-type-enum";

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== "navigate") {
      return false;
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith("/_")) {
      return false;
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    // Return true to signal that we want to use the handler.
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.endsWith(".png"),
  // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.

self.addEventListener("push", async (event) => {
  const notification: INotificationDto | undefined = event?.data?.json();
  if (!notification) {
    return;
  }
  
  // TODO: Refactor, maybe add some other data properties if needed
  let data: any;
  switch (notification.type) {
    case NotificationTypeEnum.ACTIVITY_INV || NotificationTypeEnum.ACTIVITY_CHANGE:
      data = { url: `https://app.offli.eu/activity/detail/${notification.properties?.activity?.id}`}
        break;
      case NotificationTypeEnum.BUDDY_REQ:
        data = { url: `https://app.offli.eu/profile/user/${notification.properties?.user?.id}`}
        break;
      default:
        return;
  }

  let actions: NotificationAction[] | undefined;
  if (notification.type === NotificationTypeEnum.BUDDY_REQ || notification.type === NotificationTypeEnum.ACTIVITY_INV) {
    actions = [{
      action: "accept",
      title: "accept",
      // icon: "", // TODO: Add some icon?
    }];
  }
  
  const options: NotificationOptions = {
    actions: actions,
    body: getNotificationBody(notification, false),
    icon: `https://app.offli.eu/api/files/${getNotificationPicture(notification)}`, // TODO: API URL from env
    badge: `https://app.offli.eu/logo192.png`, // TODO: Base URL from env
    data: data,
  };
  
  event.waitUntil(self.registration.showNotification(getNotificationTitle(notification), options));
});

self.addEventListener('notificationclick', (event) => {
  // TODO: Improve + implement actions click handling
  event.notification.close();
  self.clients.openWindow(event.notification.data.url);
});