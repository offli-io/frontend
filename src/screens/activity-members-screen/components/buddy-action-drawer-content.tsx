import PersonOffIcon from "@mui/icons-material/PersonOff";
import StarIcon from "@mui/icons-material/Star";
import { Box, IconButton, MenuItem, Typography } from "@mui/material";
import React from "react";
import { ActivitiyParticipantStatusEnum } from "../../../types/activities/activity-participant-status-enum.dto";
import { ActivityMembersActionTypeDto } from "../../../types/common/activity-members-action-type.dto";

interface IBuddyActionContentProps {
  onActionClick?: (
    actionType: ActivityMembersActionTypeDto,
    userId?: number
  ) => void;
  userId?: number;
  userStatus?: ActivitiyParticipantStatusEnum;
}

export const BuddyActionDrawerContent: React.FC<IBuddyActionContentProps> = ({
  userStatus,
  userId,
  onActionClick,
}) => {
  return (
    <>
      {userStatus === ActivitiyParticipantStatusEnum.CONFIRMED ? (
        <MenuItem
          onClick={() =>
            onActionClick?.(ActivityMembersActionTypeDto.PROMOTE, userId)
          }
          sx={{ px: 2 }}
          divider
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton sx={{ mr: 0.5, pl: 0 }}>
              <StarIcon color="primary" />
            </IconButton>
            <Typography>Promote to leader</Typography>
          </Box>
        </MenuItem>
      ) : null}

      {userStatus === ActivitiyParticipantStatusEnum.CONFIRMED ? (
        <MenuItem
          onClick={() =>
            onActionClick?.(ActivityMembersActionTypeDto.KICK, userId)
          }
          sx={{ px: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton sx={{ mr: 0.5, pl: 0 }}>
              <PersonOffIcon color="error" />
            </IconButton>
            <Typography>Kick from activity</Typography>
          </Box>
        </MenuItem>
      ) : null}

      {userStatus === ActivitiyParticipantStatusEnum.INVITED ? (
        <MenuItem
          onClick={(e) =>
            onActionClick?.(ActivityMembersActionTypeDto.KICK, userId)
          }
          sx={{ px: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton sx={{ mr: 0.5, pl: 0 }}>
              <PersonOffIcon color="error" />
            </IconButton>
            <Typography>Revoke invite</Typography>
          </Box>
        </MenuItem>
      ) : null}
    </>
  );
};
