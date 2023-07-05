import { IconButton, Box, Menu, MenuItem, Typography } from "@mui/material";
import Fade from "@mui/material/Fade";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { ActivityMembersActionTypeDto } from "../../../types/common/activity-members-action-type.dto";

interface IBuddyActionContentProps {
  userId?: number;
  onActionClick?: (
    actionType: ActivityMembersActionTypeDto,
    userId?: number
  ) => void;
}

export const BuddyActionContent: React.FC<IBuddyActionContentProps> = ({
  userId,
  onActionClick,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (type: ActivityMembersActionTypeDto) => {
    onActionClick?.(type, userId);
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() =>
            handleMenuItemClick(ActivityMembersActionTypeDto.PROMOTE)
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
        <MenuItem
          onClick={() => handleMenuItemClick(ActivityMembersActionTypeDto.KICK)}
          sx={{ px: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton sx={{ mr: 0.5, pl: 0 }}>
              <PersonOffIcon color="error" />
            </IconButton>
            <Typography>Kick from activity</Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};
