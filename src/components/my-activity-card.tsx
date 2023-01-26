import React from "react";
import { Box, Card, Typography } from "@mui/material";
import { IActivity } from "../types/activities/activity.dto";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import useLongPress from "../hooks/use-long-press";
import TransparentChip from "./transparent-chip";
import { ActivityVisibilityEnum } from "../types/activities/activity-visibility-enum.dto";
import { format } from "date-fns";

interface IMyActivityCardProps {
  activity?: IActivity;
  // onLongPress: (activityId: string) => void;
  onPress: (activity?: IActivity) => void;
}

const MyActivityCard: React.FC<IMyActivityCardProps> = ({
  activity,
  onPress,
}) => {
  //TODO maybe in later use also need some refactoring
  const { action, handlers } = useLongPress();

  return (
    <Card
      sx={{
        width: "95%",
        // height: 70,
        // marginTop: "2%",
        // marginBottom: "2%",
        // borderRadius: "12px",
        // display: "flex",
        // alignItems: "flex-end",
        // color: "white",
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        //justifyContent: "space-between",
        boxSizing: "border-box",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: 1,
        px: 2,
        mb: 2,
      }}
      onClick={() => onPress(activity)}
    >
      <Box
        sx={{
          height: "100%",
          maxWidth: 250,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <Typography variant="h5">{activity?.title ?? "Title"}</Typography>
        <Typography variant="subtitle2">
          {activity?.location?.name ?? "Location"}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PeopleAltIcon sx={{ fontSize: "1.2rem" }} />
          <Typography variant="body1" sx={{ ml: 1 }}>
            {`${activity?.participants?.length ?? 0} / ${activity?.limit ?? 0}`}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">
          {format(
            (activity?.datetime_from
              ? new Date(activity?.datetime_from)
              : new Date()) as Date,
            "dd"
          )}
        </Typography>
        <Typography variant="subtitle2">
          {format(
            (activity?.datetime_from
              ? new Date(activity?.datetime_from)
              : new Date()) as Date,
            "LLLL"
          )}
        </Typography>
        <Typography variant="body1">
          {format(
            (activity?.datetime_from
              ? new Date(activity?.datetime_from)
              : new Date()) as Date,
            "HH:mm"
          )}
        </Typography>
      </Box>
    </Card>
  );
};

export default MyActivityCard;
