import React from "react";
import { Box } from "@mui/material";
import MenuItem from "../../../components/menu-item";
import { IPerson } from "../../../types/activities/activity.dto";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import { useBuddyActions } from "../hooks/use-buddy-actions";
import { BuddyActionTypeEnum } from "../../../types/common/buddy-actions-type-enum.dto";
// import { useActivityMenuItems } from "../hooks/use-activity-menu-items";

export interface IBuddyActionsProps {
  onBuddyActionClick?: (type?: BuddyActionTypeEnum, userId?: string) => void;
  buddy?: IPerson;
}

const BuddyActions: React.FC<IBuddyActionsProps> = ({
  onBuddyActionClick,
  buddy,
}) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  // const isCreator = activity?.creator?.id === userInfo?.id;
  // const isParticipant = !!activity?.participants?.find(
  //   (participant) => participant?.id === userInfo?.id
  // );

  const menuItems = useBuddyActions();

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
          key={`buddy_action${actionDefinition?.type}`}
          //temporary solution just add bolean if next icon should be displayed
          headerRight={<></>}
          onMenuItemClick={() =>
            onBuddyActionClick?.(actionDefinition?.type, buddy?.id)
          }
        />
      ))}
    </Box>
  );
};

export default BuddyActions;
