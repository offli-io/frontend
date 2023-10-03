import { Box, Card, SxProps, Typography, useTheme } from "@mui/material";
import { CustomizationContext } from "assets/theme/customization-provider";
import { useGetApiUrl } from "hooks/use-get-api-url";
import React from "react";
import { IActivity } from "types/activities/activity.dto";
import { ACTIVITY_ASPECT_RATIO } from "utils/common-constants";

interface ILastAttendedActivityCardProps {
  activity?: IActivity;
  imageUrl?: string;
  sx?: SxProps;
  onPress?: (activity?: IActivity) => void;
}

const LastAttendedActivityCard: React.FC<ILastAttendedActivityCardProps> = ({
  activity,
  sx,
  onPress,
  ...rest
}) => {
  //TODO maybe in later use also need some refactoring
  const { mode } = React.useContext(CustomizationContext);
  const baseUrl = useGetApiUrl();

  return (
    <Card
      sx={{
        display: "flex",
        maxHeight: 80,
        borderRadius: 4,
        m:1,
        background: "linear-gradient(90deg, rgba(74, 20, 140, 0.18) 0%, rgba(74, 20, 140, 0.18) 44.06%, rgba(255, 255, 255, 0.00) 90.95%)",
        ...sx,
      }}
      {...rest}
      onClick={() => onPress?.(activity)}
    >
      <img
        src={`${baseUrl}/files/${activity?.title_picture}`}
        alt="profile"
        style={{
          width: "35%",
          aspectRatio: ACTIVITY_ASPECT_RATIO,
          maxHeight: 80,
          objectFit: "cover",
        }}
      />
      <Box
        sx={{
          width: "65%",
          alignItems: "center",
          justifyContent: "flex-start",
          display: "flex",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        <Typography
          sx={{
            color: ({ palette }) => palette?.primary?.main,
            ml:2
          }}
          variant="h5"
        >
          {activity?.title}
        </Typography>
      </Box>

      
    </Card>
  );
};

export default LastAttendedActivityCard;
