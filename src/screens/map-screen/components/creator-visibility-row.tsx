import React from "react";
import { IPerson } from "../../../types/activities/activity.dto";
import { ActivityVisibilityEnum } from "../../../types/activities/activity-visibility-enum.dto";
import { Box } from "@mui/system";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Typography } from "@mui/material";
import userPlaceholder from "../../../assets/img/user-placeholder.svg";
import { useGetApiUrl } from "../../../hooks/use-get-api-url";

interface IProps {
  creator?: IPerson;
  visibility?: ActivityVisibilityEnum | string;
}

export const CreatorVisibilityRow: React.FC<IProps> = ({
  creator,
  visibility,
}) => {
  const baseUrl = useGetApiUrl();

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
          // mt: 1,
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
            src={
              creator?.profile_photo
                ? `${baseUrl}/files/${creator?.profile_photo}`
                : userPlaceholder
            }
            alt="profile"
            style={{
              height: "25px",
              width: "25px",
              borderRadius: "50%",
            }}
          />
          <Typography variant="subtitle1" align="left" sx={{ ml: 1 }}>
            {creator?.username ?? "User"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            color: "grey",
          }}
        >
          {visibility === ActivityVisibilityEnum.private ? (
            <>
              <LockIcon sx={{ mr: 0.5, fontSize: 18 }} />
              <Typography variant="subtitle1" align="left">
                Private
              </Typography>
            </>
          ) : (
            <>
              <LockOpenIcon sx={{ mr: 0.5, fontSize: 18 }} />
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
