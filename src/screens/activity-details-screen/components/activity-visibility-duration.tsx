import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Box, Typography } from "@mui/material";
import React from "react";
import { ActivityVisibilityEnum } from "types/activities/activity-visibility-enum.dto";
import ActivityTags from "./activity-tags";

interface IProps {
  visibility?: ActivityVisibilityEnum;
  duration?: string;
  createdDateTime?: string;
  tags: string[];
  description?: string;
}

const ActivityVisibilityDuration: React.FC<IProps> = ({
  visibility,
  duration,
  createdDateTime,
  tags,
  description,
}) => {
  return (
    <>
      <Box
        sx={{
          mt: 5,
          mb: 1,
          px: 1,
          overflow: "hidden",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" align="left">
          Duration
        </Typography>

        <Typography variant="subtitle1" align="right" sx={{ fontSize: "16px" }}>
          {duration}
        </Typography>
      </Box>

      <ActivityTags tags={tags} sx={{ mt: 3 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          mt: 5,
          mb: 3,
          px: 1,
        }}
      >
        <Typography variant="h4" align="left">
          Additional description
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {visibility === ActivityVisibilityEnum.private ? (
            <LockIcon sx={{ fontSize: 20 }} />
          ) : (
            <LockOpenIcon sx={{ fontSize: 20 }} />
          )}
          <Typography
            variant="h6"
            align="left"
            sx={{
              ml: 0.5,
            }}
          >
            {visibility}
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ m: 0.5 }}>{description}</Typography>

      <Typography
        variant="subtitle1"
        align="center"
        sx={{
          fontSize: "12px",
          m: 3,
          color: "inactive",
        }}
      >
        Created at {createdDateTime}
      </Typography>
    </>
  );
};

export default ActivityVisibilityDuration;
