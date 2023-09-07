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
  // cant use useParams() hook because this Provider is outside <Router> context
  const pathnameArray = window.location.href.split("/");
  const activityId = pathnameArray[pathnameArray.length - 1];
  const { data, isLoading } = useActivities<IActivityRestDto>({
    id: Number(activityId),
  });

  return (
    <ActivityActions
      activity={data?.data?.activity}
      onActionClick={onMenuItemClick}
      // contrastText
    />
  );
};

export default ActivityDetailActionMenu;
