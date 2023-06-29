import React from "react";
import { Box, Typography } from "@mui/material";
import BackHeader from "../../components/back-header";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { setAuthToken } from "../../utils/token.util";
import { useLocation, useNavigate } from "react-router-dom";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { useNotifications } from "../../hooks/use-notifications";
import NotificationRequest from "../../components/notification-request";
import { INotificationDto } from "../../types/notifications/notification.dto";
import { NotificationTypeEnum } from "../../types/notifications/notification-type-enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsSeen } from "../../api/notifications/requests";
import { useSnackbar } from "notistack";
import { ICustomizedLocationStateDto } from "../../types/common/customized-location-state.dto";

const NotificationsScreen = () => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location?.state as ICustomizedLocationStateDto)?.from;
  const { data } = useNotifications(userInfo?.id);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: sendMarkNotification } = useMutation(
    ["mark-notification"],
    (notification: INotificationDto) =>
      markNotificationAsSeen(notification?.id),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["notifications"]);
        navigateBasedOnType(
          variables?.type,
          variables?.properties?.user?.id ?? variables?.properties?.activity?.id
        );
      },
      onError: () => {
        enqueueSnackbar("Failed to load notification detail", {
          variant: "error",
        });
      },
    }
  );

  const navigateBasedOnType = React.useCallback(
    (type?: NotificationTypeEnum, id?: number) => {
      if (type === NotificationTypeEnum.ACTIVITY_INV) {
        return navigate(`${ApplicationLocations.ACTIVITIES}/request/${id}`, {
          state: {
            from: window.location.href,
          },
        });
      }
      if (type === NotificationTypeEnum.BUDDY_INV) {
        return navigate(`${ApplicationLocations.PROFILE}/request/${id}`, {
          state: {
            from: window.location.href,
          },
        });
      }
      return;
    },
    [navigate]
  );

  const handleNotificationClick = React.useCallback(
    (notification: INotificationDto) => {
      return notification?.seen
        ? navigateBasedOnType(
            notification?.type,
            notification?.properties?.user?.id ??
              notification?.properties?.activity?.id
          )
        : sendMarkNotification(notification);
    },
    []
  );

  const areAnyNotifications =
    data?.data?.notifications && data?.data?.notifications?.length > 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}
    >
      {/* <BackHeader title="Notifications" sx={{ mb: 2 }} to={from} /> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          px: 2,
          boxSizing: "border-box",
        }}
      >
        {areAnyNotifications ? (
          data?.data?.notifications?.map((notification) => (
            <NotificationRequest
              key={notification?.id}
              notification={notification}
              onClick={handleNotificationClick}
            />
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              mt: 4,
              // alignItems: "center",
              // height: "100%",
            }}
          >
            <Typography variant="subtitle2">
              You have no new notifications
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NotificationsScreen;
