import { Box, Divider, Typography, useTheme } from "@mui/material";
import { differenceInHours } from "date-fns";
import React from "react";
import userPlaceholder from "../assets/img/user-placeholder.svg";
import { useGetApiUrl } from "../hooks/use-get-api-url";
import { NotificationTypeEnum } from "../types/notifications/notification-type-enum";
import { INotificationDto } from "../types/notifications/notification.dto";

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

  // console.log(
  //   format(new Date(`${notification?.timestamp}` * 1000), DATE_TIME_FORMAT)
  // );
  const generateNotificationMessage = React.useCallback(() => {
    if (notification?.type === NotificationTypeEnum.BUDDY_REQ) {
      return `${notification?.properties?.user?.username} sent you request to become buddies`;
    }
    if (notification?.type === NotificationTypeEnum.ACTIVITY_REQ) {
      return `${notification?.properties?.user?.username} invited you to join activity`;
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
            gridTemplateColumns: "4fr 1fr",
            alignItems: "center",
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
                height: 35,
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

            <Typography
              sx={{
                ml: 2,
                color: "black",
                fontWeight: notification?.seen ? "normal" : "bold",
              }}
              variant="subtitle1"
            >
              {generateNotificationMessage()}
            </Typography>
          </Box>
          <Typography
            sx={{
              ml: 2,
              color: (theme) => theme.palette.inactiveFont.main,
              fontSize: "0.8rem",
              textAlign: "end",
            }}
          >
            {hourDifference()}
          </Typography>
          {/* </Box> */}
        </Box>
      </Box>
      <Divider sx={{ width: "100%" }} />
    </>
  );
};
export default NotificationRequest;
