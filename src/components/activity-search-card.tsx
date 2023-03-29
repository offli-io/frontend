import React from "react";
import { Box, Card, SxProps, Typography } from "@mui/material";
import { IActivity } from "../types/activities/activity.dto";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import useLongPress from "../hooks/use-long-press";
import TransparentChip from "./transparent-chip";
import { ActivityVisibilityEnum } from "../types/activities/activity-visibility-enum.dto";
import { format } from "date-fns";
import NearMeIcon from "@mui/icons-material/NearMe";

import activityPlaceholderImage from "../assets/img/activity-placeholder-image.svg";
import { calculateDistance } from "../utils/calculate-distance.util";
import { useUsers } from "../hooks/use-users";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import { LatLngTuple } from "leaflet";

interface IMyActivityCardProps {
  activity?: IActivity;
  // onLongPress: (activityId: string) => void;
  onPress: (activity?: IActivity) => void;
  sx?: SxProps;
}

const ActivitySearchCard: React.FC<IMyActivityCardProps> = ({
  activity,
  onPress,
  sx,
}) => {
  //TODO maybe in later use also need some refactoring
  const { action, handlers } = useLongPress();
  const { userInfo } = React.useContext(AuthenticationContext);
  const { data: { data: userData } = {} } = useUsers({
    id: userInfo?.id,
  });

  return (
    <Card
      sx={{
        minWidth: 300,
        display: "grid",
        gridTemplateColumns: "2fr 5fr",
        boxSizing: "border-box",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: 1,
        px: 2,
        mb: 2,
        mr: 2,
        ...sx,
      }}
      onClick={() => onPress(activity)}
    >
      <Box sx={{ p: 0.5 }}>
        <img
          src={activity?.title_picture ?? activityPlaceholderImage}
          alt="activity_image"
          style={{ height: 70 }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {activity?.title}
        </Typography>
        <Typography sx={{ fontSize: 12 }}>
          {activity?.location?.name}
        </Typography>

        <Typography sx={{ fontSize: 12 }}>
          {format(
            (activity?.datetime_from
              ? new Date(activity?.datetime_from)
              : new Date()) as Date,
            "dd:mm:yyyy , hh:mm"
          )}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <NearMeIcon sx={{ fontSize: 18, mr: 1 }} />
            <Typography>
              {`${calculateDistance(activity?.location?.coordinates, {
                lon: 25.2,
                lat: -75.25,
              })} km`}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default ActivitySearchCard;
