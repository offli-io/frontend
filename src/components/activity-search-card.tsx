import React from "react";
import { Box, Card, IconButton, SxProps, Typography } from "@mui/material";
import { IActivity, IPersonExtended } from "../types/activities/activity.dto";
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
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { LatLngTuple } from "leaflet";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useUser } from "../hooks/use-user";

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
  ...rest
}) => {
  //TODO maybe in later use also need some refactoring
  const { action, handlers } = useLongPress();
  const { userInfo } = React.useContext(AuthenticationContext);
  const { data: { data = {} } = {} } = useUser({
    id: userInfo?.id,
  });

  return (
    <Box
      sx={{
        minWidth: 300,
        display: "grid",
        gridTemplateColumns: "2fr 5fr",
        alignItems: "center",
        // boxSizing: "border-box",
        // boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: 1,
        mb: 2,
        ...sx,
      }}
      onClick={() => onPress(activity)}
      data-testid="activity-search-card"
      {...rest}
    >
      <Box sx={{ p: 0.5, mr: 1 }}>
        <img
          src={activity?.title_picture_url ?? activityPlaceholderImage}
          alt="activity_image"
          style={{ height: 80, borderRadius: 10 }}
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
        <Box sx={{ display: "flex" }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {activity?.title}
            </Typography>
            <Typography sx={{ fontSize: 12, lineHeight: 1.2 }}>
              {activity?.location?.name}
            </Typography>

            <Typography sx={{ fontSize: 12, lineHeight: 1.2 }}>
              {format(
                (activity?.datetime_from
                  ? new Date(activity?.datetime_from)
                  : new Date()) as Date,
                "dd:mm:yyyy , hh:mm"
              )}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <NearMeIcon sx={{ fontSize: 18, mr: 0.5 }} />
            <Typography sx={{ fontSize: 12 }}>
              {`${calculateDistance(activity?.location?.coordinates, {
                lon: 25.2,
                lat: -75.25,
              })} km`}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PeopleAltIcon sx={{ fontSize: 18, mr: 0.5 }} />
            <Typography sx={{ fontSize: 12 }}>
              {`${activity?.participants?.length ?? 0}/${activity?.limit}`}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <MonetizationOnIcon sx={{ fontSize: 18, mr: 0.5 }} />
            <Typography sx={{ fontSize: 12 }}>
              {`${activity?.price}`}
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* <Box>
        <IconButton onClick={() => console.log("join activity")}>
          <AddCircleOutlineIcon color="primary" />
        </IconButton>
      </Box> */}
    </Box>
  );
};

export default ActivitySearchCard;
