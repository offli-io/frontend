import React from "react";
import { Box, Typography } from "@mui/material";
import MyActivityCard from "../../components/my-activity-card";
import { PageWrapper } from "../../components/page-wrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removePersonFromActivity } from "../../api/activities/requests";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { DrawerContext } from "../../assets/theme/drawer-provider";
import ActivityActions from "./components/activity-actions";
import { ActivityActionsTypeEnumDto } from "../../types/common/activity-actions-type-enum.dto";
import { useNavigate } from "react-router-dom";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import ActivityLeaveConfirmation from "./components/activity-leave-confirmation";
import { useSnackbar } from "notistack";
import { useActivities } from "../../hooks/use-activities";
import { IActivityListRestDto } from "../../types/activities/activity-list-rest.dto";
import Map from "../../components/map";
import ActivityCard from "../../components/activity-card";

const ActivitiesScreen = () => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const { toggleDrawer } = React.useContext(DrawerContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: { data: { activities = [] } = {} } = {} } =
    useActivities<IActivityListRestDto>();

  const hideDrawer = React.useCallback(() => {
    return toggleDrawer({
      open: false,
      content: undefined,
    });
  }, [toggleDrawer]);

  const { mutate: sendLeaveActivity } = useMutation(
    ["leave-activity"],
    (activityId?: string) =>
      removePersonFromActivity({ activityId, personId: userInfo?.id }),
    {
      onSuccess: () => {
        hideDrawer();
        //TODO add generic jnaming for activites / activity
        queryClient.invalidateQueries(["activity"]);
        queryClient.invalidateQueries(["activities"]);
        //invalidate queries
        //TODO display success notification?
      },
      onError: () => {
        enqueueSnackbar("Failed to leave activity", { variant: "error" });
      },
    }
  );

  const handleActionClick = React.useCallback(
    (action?: ActivityActionsTypeEnumDto, activityId?: string) => {
      switch (action) {
        case ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS:
          return navigate(
            `${ApplicationLocations.ACTIVITY_ID}/${activityId}/members`
          );
        case ActivityActionsTypeEnumDto.LEAVE:
          return toggleDrawer({
            open: true,
            content: (
              <ActivityLeaveConfirmation
                activityId={activityId}
                onLeaveCancel={hideDrawer}
                onLeaveConfirm={sendLeaveActivity}
              />
            ),
          });
        case ActivityActionsTypeEnumDto.MORE_INFORMATION:
          return navigate(`${ApplicationLocations.ACTIVITY_ID}/${activityId}`);
        default:
          return console.log(action);
      }
    },
    []
  );

  const openActivityActions = React.useCallback(
    (activityId?: string) =>
      toggleDrawer({
        open: true,
        content: (
          <ActivityActions
            onActionClick={handleActionClick}
            activityId={activityId}
          />
        ),
      }),
    [toggleDrawer]
  );

  React.useEffect(() => {
    //TODO is this fast enough isn't it flickering? Should I hide drawer before redirecting?
    return () =>
      toggleDrawer({
        open: false,
      });
  }, [toggleDrawer]);

  return (
    <PageWrapper>
      <Typography
        variant="h6"
        sx={{
          width: "88%",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        My Actititties
      </Typography>

      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {activities?.map((activity) => {
          return (
            <MyActivityCard
              key={activity?.id}
              activity={activity}
              onLongPress={openActivityActions}
              onPress={openActivityActions}
            />
          );
        })}
      </Box>
    </PageWrapper>
  );
};

export default ActivitiesScreen;
