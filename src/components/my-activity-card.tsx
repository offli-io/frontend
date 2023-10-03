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
import { useGetApiUrl } from "hooks/use-get-api-url";
import { DATE_TIME_FORMAT } from "utils/common-constants";

interface IMyActivityCardProps {
  activity?: IActivity;
  // onLongPress: (activityId: string) => void;
  onPress?: (activity?: IActivity) => void;
  onLongPress?: (activity?: IActivity) => void;
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
  const { action, handlers } = useLongPress({
    onLongPress: () => onLongPress?.(activity),
  });
  const baseUrl = useGetApiUrl();

  // React.useEffect(() => {
  //   if (action) {
  //     onLongPress?.(activity);
  //   }
  // }, [action, onLongPress]);

  return (
    <OffliButton
      sx={{
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        boxSizing: "border-box",
        borderColor: "primary.light",
        borderWidth: 1,
        borderStyle: "solid",
        minWidth: "280px",
        maxWidth: "280px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "normal",
        bgcolor: "background.default"
      }}
      color="inherit"
      {...handlers}
      onClick={() => onPress?.(activity)}
      data-testid="my-activitiy-card"
      {...rest}
    >
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: 260,
          }}
        >
          <Box sx={{ mt: 0.5, height: 75 }}>
            <img
              src={`${baseUrl}/files/${activity?.title_picture}`}
              alt="activity_picture"
              style={{ height: 70, width: 90, borderRadius: "10px" }}
            />
          </Box>
          <Box
            sx={{
              ml: 1.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
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
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: 1,
                color: ({ palette }) => palette?.text?.primary,
              }}
            >
              {format(
                (activity?.datetime_from
                  ? new Date(activity?.datetime_from)
                  : new Date()) as Date,
                DATE_TIME_FORMAT
              )}
            </Typography>
          </Box>
        </Box>
      </>
    </OffliButton>
  );
};

export default MyActivityCard;
