import MenuIcon from "@mui/icons-material/Menu";
import { ClickAwayListener, Fade, IconButton, Popper } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useParams } from "react-router-dom";
import { useActivities } from "../../../hooks/use-activities";
import { IActivityRestDto } from "../../../types/activities/activity-rest.dto";
import { ActivityActionsTypeEnumDto } from "../../../types/common/activity-actions-type-enum.dto";
import ActivityActions from "../../my-activities-screen/components/activity-actions";

interface IProps {
  onMenuItemClick?: (action?: ActivityActionsTypeEnumDto) => void;
}

const ActivityDetailActionMenu: React.FC<IProps> = ({ onMenuItemClick }) => {
  const [open, setOpen] = React.useState(false);


  // cant use useParams() hook because this Provider is outside <Router> context
  const pathnameArray = window.location.href.split('/')
  const activityId = pathnameArray[pathnameArray.length - 1]
  const { data, isLoading } = useActivities<IActivityRestDto>({
    id: Number(activityId),
  });


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        <IconButton
          // aria-describedby={id}
          color="primary"
          data-testid="toggle-activity-menu-btn"
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
        <Popper open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Box sx={{ p: 1.5, border: 1, bgcolor: "rgba(0, 0, 0, 0.8)" }}>
                <ActivityActions
                  activity={data?.data?.activity}
                  onActionClick={onMenuItemClick}
                  contrastText
                />
              </Box>
            </Fade>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default ActivityDetailActionMenu;
