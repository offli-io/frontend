import { Box, Divider } from "@mui/material";
import React from "react";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import MenuItem from "../../../components/menu-item";
import { IActivity } from "../../../types/activities/activity.dto";
import { ActivityActionsTypeEnumDto } from "../../../types/common/activity-actions-type-enum.dto";
import { useActivityMenuItems } from "../hooks/use-activity-menu-items";
import { getActivityParticipants } from "../../../api/activities/requests";
import { useQuery } from "@tanstack/react-query";
import { ActivityVisibilityEnum } from "../../../types/activities/activity-visibility-enum.dto";

export interface IActivityActionsProps {
  onActionClick?: (
    type?: ActivityActionsTypeEnumDto,
    activityId?: number
  ) => void;
  activity?: IActivity;
  contrastText?: boolean;
}

const ActivityActions: React.FC<IActivityActionsProps> = ({
  onActionClick,
  activity,
  contrastText,
}) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const isCreator = activity?.creator_id === userInfo?.id;

  const {
    data: { data: { participants = [] } = {} } = {},
    isLoading: areActivityParticipantsLoading,
  } = useQuery(
    ["activity-participants", activity?.id],
    () => getActivityParticipants({ activityId: Number(activity?.id) }),
    {
      enabled: !!activity?.id,
    }
  );

  const isParticipant = !!participants?.find(
    (participant) => participant?.id === userInfo?.id
  );

  const menuItems = useActivityMenuItems({
    isCreator,
    isParticipant,
    isPrivate: activity?.visibility === ActivityVisibilityEnum.private,
    contrastText,
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
      {menuItems?.map((actionDefinition, index) => (
        <>
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
            contrastText={contrastText}
          />
          {index !== menuItems?.length - 1 ? (
            <Divider
              sx={{ bgcolor: ({ palette }) => palette?.inactive?.main }}
            />
          ) : null}
        </>
      ))}
    </Box>
  );
};

export default ActivityActions;
