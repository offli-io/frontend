import React from "react";
import { Box, Switch } from "@mui/material";
import { ActivityActionsTypeEnumDto } from "../../../types/common/activity-actions-type-enum.dto";
import { ActivityActionsDefinitions } from "./activity-actions-definitions";
import MenuItem from "../../../components/menu-item";
import { IActivity } from "../../../types/activities/activity.dto";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import { useActivityMenuItems } from "../hooks/use-activity-menu-items";

export interface IActivityActionsProps {
  onActionClick?: (
    type?: ActivityActionsTypeEnumDto,
    activityId?: number
  ) => void;
  activity?: IActivity;
}

const ActivityActions: React.FC<IActivityActionsProps> = ({
  onActionClick,
  activity,
}) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const isCreator = activity?.creator_id === userInfo?.id;
  const isParticipant = !!activity?.participants?.find(
    (participant) => participant?.id === userInfo?.id
  );

  const menuItems = useActivityMenuItems({
    isCreator,
    isParticipant,
  });

  return (
    <Box
      sx={{
        // display: 'flex',
        // flexDirection: 'column',
        width: "100%",
        // height: '100vh',
      }}
    >
      {menuItems?.map((actionDefinition) => (
        <MenuItem
          label={actionDefinition?.label}
          type={actionDefinition?.type}
          icon={actionDefinition?.icon}
          key={`activity_action_${actionDefinition?.type}`}
          //temporary solution just add bolean if next icon should be displayed
          headerRight={<></>}
          onMenuItemClick={() =>
            onActionClick?.(actionDefinition?.type, activity?.id)
          }
        />
      ))}
    </Box>
  );
};

export default ActivityActions;
