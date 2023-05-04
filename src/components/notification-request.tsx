import { Box, Divider, styled, Typography } from "@mui/material";
import logo from "../assets/img/profilePicture.jpg";
import React from "react";
import { INotificationDto } from "../types/notifications/notification.dto";
import { useUsers } from "../hooks/use-users";
import { differenceInHours } from "date-fns";
import { IPersonExtended } from "../types/activities/activity.dto";

interface INotificationRequestProps {
  notification: INotificationDto;
  onClick: (notifcation: INotificationDto) => void;
}

const StyledImage = styled((props: any) => (
  <img {...props} alt="Notification profile" />
))`
  height: 40px;
  width: 40px;
  background-color: #c9c9c9;
  border-radius: 50%;
  box-shadow: 1px 3px 2px #ccc;
`;

const NotificationRequest: React.FC<INotificationRequestProps> = ({
  notification,
  onClick,
}) => {
  const { data, isLoading } = useUsers<IPersonExtended>({
    id: notification?.user_id,
  });

  const hourDifference = React.useCallback(() => {
    if (notification?.timestamp) {
      const unixDate = new Date(notification.timestamp);
      return `${differenceInHours(new Date(), unixDate)} h`;
    }
    return undefined;
  }, [notification?.timestamp]);

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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              backgroundColor: (theme) =>
                notification?.seen ? "transparent" : theme.palette.primary.main,
              height: 10,
              width: 13,
              borderRadius: 5,
              mr: 1.5,
            }}
          />
          <StyledImage src={data?.data?.profile_photo_url ?? logo} />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                ml: 2,
                color: "black",
                fontWeight: notification?.seen ? "normal" : "bold",
              }}
            >
              {notification?.message}
            </Typography>
            <Typography
              sx={{
                ml: 2,
                color: (theme) => theme.palette.inactiveFont.main,
                fontSize: "0.8rem",
              }}
            >
              {hourDifference()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ width: "100%" }} />
    </>
  );
};
export default NotificationRequest;
