import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Box, Typography } from "@mui/material";
import React from "react";
import { ActivityVisibilityEnum } from "types/activities/activity-visibility-enum.dto";

interface IProps {
  visibility?: ActivityVisibilityEnum;
  duration?: string;
  createdDateTime?: string;
}

const ActivityVisibilityDuration: React.FC<IProps> = ({
  visibility,
  duration,
  createdDateTime,
}) => {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          alignItems: "center",
          // justifyContent: "space-between",
          mt: 3,
          px: 1,
        }}
      >
        <Box sx={{ mb: 1, overflow: "hidden" }}>
          <Typography
            variant="h5"
            align="left"
            sx={{ fontSize: "16px", mb: 0.5 }}
          >
            Activity visibility
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
        <Box sx={{ mb: 1, overflow: "hidden" }}>
          <Typography
            variant="h5"
            align="left"
            sx={{ fontSize: "16px", mb: 0.5, textAlign: "end" }}
          >
            Duration
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              variant="subtitle1"
              align="left"
              sx={{ fontSize: "14px" }}
            >
              {duration}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ fontSize: "12px", mb: 1, color: "grey" }}
      >
        Created {createdDateTime}
      </Typography>
    </>
  );
};

export default ActivityVisibilityDuration;
