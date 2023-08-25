import React from "react";
import { Box, Card, SxProps, Typography, useTheme } from "@mui/material";
import { IActivity } from "../types/activities/activity.dto";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import useLongPress from "../hooks/use-long-press";
import TransparentChip from "./transparent-chip";
import { ActivityVisibilityEnum } from "../types/activities/activity-visibility-enum.dto";
import { format } from "date-fns";
import OffliButton from "./offli-button";

interface IMyActivityCardProps {
  activity?: IActivity;
  // onLongPress: (activityId: string) => void;
  onPress: (activity?: IActivity) => void;
  onLongPress: (activity?: IActivity) => void;
  sx?: SxProps;
}

const MyActivityCard: React.FC<IMyActivityCardProps> = ({
  activity,
  onPress,
  onLongPress,
  sx,
  ...rest
}) => {
  //TODO maybe in later use also need some refactoring
  const { action, handlers } = useLongPress();
  const { shadows } = useTheme();

  React.useEffect(() => {
    if (action) {
      onLongPress?.(activity);
    }
  }, [action, onLongPress]);

  return (
    <Card
      sx={{
        minWidth: 300,
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        boxSizing: "border-box",
        boxShadow: shadows[3],
        py: 1.5,
        px: 2,
        mb: 2,
        mr: 2,
        ...sx,
      }}
      {...handlers}
      onClick={() => onPress(activity)}
      data-testid="my-activitiy-card"
      {...rest}
    >
      <Box
        sx={{
          height: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: "bold",
            lineHeight: 1,
            color: ({ palette }) => palette?.text?.primary,
          }}
        >
          {activity?.title ?? "Title"}
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            // fontWeight: "bold",
            lineHeight: 1,
            color: ({ palette }) => palette?.text?.primary,
            my: 0.75,
          }}
        >
          {activity?.location?.name ?? "Location"}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PeopleAltIcon sx={{ fontSize: 16 }} />
          <Typography
            sx={{
              ml: 1,
              fontSize: 16,
              lineHeight: 1,
              color: ({ palette }) => palette?.text?.primary,
            }}
          >
            {`${activity?.count_confirmed ?? 0} / ${activity?.limit ?? 0}`}
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
        <Typography
          sx={{
            fontSize: 18,
            // fontWeight: "bold",
            lineHeight: 1,
            color: ({ palette }) => palette?.text?.primary,
          }}
        >
          {format(
            (activity?.datetime_from
              ? new Date(activity?.datetime_from)
              : new Date()) as Date,
            "dd"
          )}
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            lineHeight: 1,
            color: ({ palette }) => palette?.text?.primary,
            my: 0.75,
          }}
        >
          {format(
            (activity?.datetime_from
              ? new Date(activity?.datetime_from)
              : new Date()) as Date,
            "LLLL"
          )}
        </Typography>
        <Typography
          sx={{
            fontSize: 16,
            // fontWeight: "bold",
            lineHeight: 1,
            color: ({ palette }) => palette?.text?.primary,
          }}
        >
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
