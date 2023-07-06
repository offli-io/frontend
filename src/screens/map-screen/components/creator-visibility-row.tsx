import React from "react";
import { IPerson } from "../../../types/activities/activity.dto";
import { ActivityVisibilityEnum } from "../../../types/activities/activity-visibility-enum.dto";
import { Box } from "@mui/system";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Typography } from "@mui/material";

interface IProps {
  creator?: IPerson;
  visibility?: ActivityVisibilityEnum | string;
}

export const CreatorVisibilityRow: React.FC<IProps> = ({
  creator,
  visibility,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        flexDirection: "column",
        flex: 1,
        mb: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "95%",
          mt: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <img
            src={creator?.profile_photo_url}
            alt="profile"
            style={{
              height: "25px",
              width: "25px",
              borderRadius: "50%",
            }}
          />
          <Typography variant="subtitle1" align="left" sx={{ ml: 0.3 }}>
            {/* {creator?.name} */}
            Aaaaaaaaaaaaaa
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {visibility === ActivityVisibilityEnum.private ? (
            <>
              <LockIcon sx={{ mr: 0.5 }} />
              <Typography variant="subtitle1" align="left">
                Private
              </Typography>
            </>
          ) : (
            <>
              <LockOpenIcon sx={{ mr: 0.5 }} />
              <Typography variant="subtitle1" align="left">
                Public
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
