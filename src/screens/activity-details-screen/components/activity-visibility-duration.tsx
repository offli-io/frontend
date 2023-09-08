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
}

const ActivityVisibilityDuration: React.FC<IProps> = ({
  visibility,
  duration,
  createdDateTime,
  tags,
}) => {
  return (
    <>
      <Box
        sx={{
          mt: 5,
          mb: 1,
          overflow: "hidden",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h5"
          align="left"
          sx={{ fontSize: "16px", mb: 0.5, textAlign: "end" }}
        >
          Duration
        </Typography>

        <Typography variant="subtitle1" align="right" sx={{ fontSize: "14px" }}>
          {duration}
        </Typography>
      </Box>

      <ActivityTags tags={tags} sx={{ mt: 3, mb: 0 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          alignItems: "center",
          mt: 5,
          px: 1,
        }}
      >
        <Typography variant="h5" align="left">
          Additional description
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {visibility === ActivityVisibilityEnum.private ? (
            <LockIcon sx={{ fontSize: 16 }} />
          ) : (
            <LockOpenIcon sx={{ fontSize: 16 }} />
          )}
          <Typography
            variant="subtitle1"
            align="left"
            sx={{ fontSize: "14px", ml: 0.5 }}
          >
            {visibility}
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ fontSize: "12px", mb: 1, color: "grey", mt: 5 }}
      >
        Created {createdDateTime}
      </Typography>
    </>
  );
};

export default ActivityVisibilityDuration;
