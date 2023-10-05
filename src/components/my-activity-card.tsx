import React from "react";
import { Box, SxProps, Typography } from "@mui/material";
import { IActivity } from "../types/activities/activity.dto";
import useLongPress from "../hooks/use-long-press";
import { format } from "date-fns";
import OffliButton from "./offli-button";
import { useGetApiUrl } from "hooks/use-get-api-url";
import { DATE_TIME_FORMAT } from "utils/common-constants";

interface IMyActivityCardProps {
  activity?: IActivity;
  // onLongPress: (activityId: string) => void;
  onPress?: (activity?: IActivity) => void;
  onLongPress?: (activity?: IActivity) => void;
  sx?: SxProps;
  type: string;
}

const MyActivityCard: React.FC<IMyActivityCardProps> = ({
  activity,
  onPress,
  onLongPress,
  sx,
  type,
  ...rest
}) => {
  //TODO maybe in later use also need some refactoring
  const { action, handlers } = useLongPress({
    onLongPress: () => onLongPress?.(activity),
  });
  const baseUrl = useGetApiUrl();

  return (
    <OffliButton
      sx={{
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        boxSizing: "border-box",
        minWidth: 280,
        maxWidth: 280,
        background: "linear-gradient(90deg, rgba(74, 20, 140, 0.18) 0%, rgba(74, 20, 140, 0.18) 44.06%, rgba(255, 255, 255, 0.00) 90.95%)",
        m:1
      }}
      color="inherit"
      {...handlers}
      onClick={() => onPress?.(activity)}
      data-testid="my-activitiy-card"
      {...rest}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: 260,
        }}
      >
        <Box sx={{ mt: 0.5, height: 75 , width: "35%"}}>
          <img
            src={`${baseUrl}/files/${activity?.title_picture}`}
            alt="activity_picture"
            style={{ height: 70, borderRadius: "10px" }}
          />
        </Box>
        {type === "explore" && (
        <Box
          sx={{
            width: "65%",
            ml: 1.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          <Typography variant="h5">
            {activity?.title ?? "Title"}
          </Typography>
          <Typography variant="subtitle1">
            {activity?.location?.name ?? "Location"}
          </Typography>
          <Typography variant="subtitle1">
            {format(
              (activity?.datetime_from
                ? new Date(activity?.datetime_from)
                : new Date()) as Date,
              DATE_TIME_FORMAT
            )}
          </Typography>
        </Box>
        )}
        {type === "profile" && (
        <Box
          sx={{
            width: "65%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          <Typography variant="h5" sx={{
            color: ({ palette }) => palette?.primary?.main,
            ml:2
          }}>
            {activity?.title ?? "Title"}
          </Typography>
        </Box>
        )}
      </Box>
    </OffliButton>
  );
};

export default MyActivityCard;
