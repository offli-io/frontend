import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { getNotifications } from "../api/notifications/requests";

export const useCurrentLocation = () => {
  return navigator.geolocation.getCurrentPosition(function (position) {
    console.log("Current location", position.coords);
    return position.coords;
  });
};
