import { Box, Divider, Typography, useTheme } from "@mui/material";
import { differenceInHours } from "date-fns";
import React from "react";
import userPlaceholder from "../assets/img/user-placeholder.svg";
import { useGetApiUrl } from "../hooks/use-get-api-url";
import { NotificationTypeEnum } from "../types/notifications/notification-type-enum";
import { INotificationDto } from "../types/notifications/notification.dto";
import SanitizedText from "./sanitized-text/sanitized-text";

interface INotificationRequestProps {
  notification: INotificationDto;
  onClick: (notifcation: INotificationDto) => void;
}

const NotificationRequest: React.FC<INotificationRequestProps> = ({
  notification,
  onClick,
}) => {
  const { shadows } = useTheme();
  const baseUrl = useGetApiUrl();

  const roundDaysIfNecessarry = React.useCallback((hours: number) => {
    if (hours === 1)
      return `${hours} hour`;
    if (hours > 24 && hours < 48)
      return `${Math.floor(hours / 24)} day`;

    return hours > 24 ? `${Math.floor(hours / 24)} days` : `${hours} hours`;
  }, []);

  const hourDifference = React.useCallback(() => {
    if (notification?.timestamp) {
      const unixDate = new Date(notification.timestamp * 1000);
      const hourDifference = differenceInHours(new Date(), unixDate);
      return hourDifference >= 1
        ? roundDaysIfNecessarry(hourDifference)
        : "just now";
    }
    return undefined;
  }, [notification?.timestamp]);

  const generateNotificationType = React.useCallback(() => {
    if (notification?.type === NotificationTypeEnum.BUDDY_REQ) {
      return `Buddy request`;
    }
    if (notification?.type === NotificationTypeEnum.ACTIVITY_REQ) {
      return `Activity invite`;
    }
    return "";
  }, [notification]);

  // console.log(
  //   format(new Date(`${notification?.timestamp}` * 1000), DATE_TIME_FORMAT)
  // );
  const generateNotificationMessage = React.useCallback(() => {
    if (notification?.type === NotificationTypeEnum.BUDDY_REQ) {
      return `${notification?.properties?.user?.username} wants to become buddies`;
    }
    if (notification?.type === NotificationTypeEnum.ACTIVITY_REQ) {
      return `${notification?.properties?.user?.username} invited you to join <br><em>${notification?.properties?.activity?.title}</em>`;
    }
    return "";
  }, [notification]);

  return (
    <>
      <Box
        onClick={() => onClick(notification)}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
          textTransform: "none",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "5fr 1fr",
            gap: 2,
            alignItems: "center",
            overflow: "hidden", textOverflow: "ellipsis"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!notification?.seen ? (
              <Box
                sx={{
                  backgroundColor: ({ palette }) => palette.primary.main,
                  height: 10,
                  minWidth: 10,
                  borderRadius: 5,
                  mr: 1.5,
                }}
              />
            ) : null}

            <img
              style={{
                height: 45,
                borderRadius: "50%",
                // border: `2px solid ${palette?.primary?.main}`,
                boxShadow: shadows[5],
              }}
              src={
                notification?.properties?.user?.profile_photo
                  ? `${baseUrl}/files/${notification?.properties?.user?.profile_photo}`
                  : userPlaceholder
              }
              alt="profile"
            />
            <Box sx={{ display: "flex", flexDirection: "column"}}>
              <Typography
                sx={{
                  fontWeight: notification?.seen ? "normal" : "bold",
                  fontSize: "h5",
                  ml: 2,
                }}
              >
                {generateNotificationType()}
              </Typography>
              <Typography
                sx={{
                  ml: 2,
                  color: "black",
                  overflowWrap: "anywhere",
                  fontWeight: notification?.seen ? "normal" : "bold",
                  overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220,
                }}
                variant="subtitle1"
              >
                <SanitizedText style={{overflow: "hidden", textOverflow: "ellipsis",whiteSpace: "nowrap"}} text={generateNotificationMessage()}/>
              </Typography>
            </Box>
          </Box>
          <Typography
            sx={{
              // ml: 2,
              color: (theme) => theme.palette.inactiveFont.main,
              fontSize: "0.8rem",
              textAlign: "center",
              minWidth: 60,
            }}
          >
            {hourDifference()}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
export default NotificationRequest;
