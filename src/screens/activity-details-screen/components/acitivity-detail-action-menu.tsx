import { Chip, Fade, IconButton, Popper } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import OffliButton from "../../../components/offli-button";
import ActivityActions from "../../my-activities-screen/components/activity-actions";
import { useParams } from "react-router-dom";
import { useActivities } from "../../../hooks/use-activities";
import { IActivityRestDto } from "../../../types/activities/activity-rest.dto";

interface IProps {
  onMenuItemClick?: () => void;
}

const ActivityDetailActionMenu: React.FC<IProps> = ({ onMenuItemClick }) => {
  const [open, setOpen] = React.useState(false);
  const { id } = useParams();
  const { data, isLoading } = useActivities<IActivityRestDto>({
    id: Number(id),
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  return (
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
                onActionClick={(action) => console.log(action)}
                contrastText
              />
            </Box>
          </Fade>
        )}
      </Popper>
    </div>
  );
};

export default ActivityDetailActionMenu;
