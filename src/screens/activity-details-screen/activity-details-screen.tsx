import { Box, Typography, Chip, IconButton } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  changeActivityParticipantStatus,
  getActivity,
} from "../../api/activities/requests";
import BackHeader from "../../components/back-header";
import { PageWrapper } from "../../components/page-wrapper";
import { IActivityRestDto } from "../../types/activities/activity-rest.dto";
import { ICustomizedLocationStateDto } from "../../types/common/customized-location-state.dto";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ActivityDetailsGrid from "./components/activity-details-grid";
import ActivityDescriptionTags from "./components/activity-description-tags";
import ActivityCreatorDuration from "./components/activity-creator-duration";
import { useUser } from "../../hooks/use-user";
import { ActivityVisibilityEnum } from "../../types/activities/activity-visibility-enum.dto";
import MenuIcon from "@mui/icons-material/Menu";
import { HeaderContext } from "../../app/providers/header-provider";
import ActivityDetailActionMenu from "./components/acitivity-detail-action-menu";
import { ActivityActionsTypeEnumDto } from "../../types/common/activity-actions-type-enum.dto";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { ActivityInviteStateEnum } from "../../types/activities/activity-invite-state-enum.dto";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { useSnackbar } from "notistack";

interface IProps {
  type: "detail" | "request";
}

const ActivityDetailsScreen: React.FC<IProps> = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location?.state as ICustomizedLocationStateDto)?.from ??
    ApplicationLocations.ACTIVITIES;
  const { setHeaderRightContent } = React.useContext(HeaderContext);
  const { userInfo } = React.useContext(AuthenticationContext);
  const { enqueueSnackbar } = useSnackbar();

  const { data } = useQuery(
    ["activity", id],
    () => getActivity<IActivityRestDto>({ id: Number(id) }),
    {
      enabled: !!id,
    }
  );

  const activity = data?.data?.activity;

  const { data: { data: activityCreator } = {}, isLoading } = useUser({
    id: activity?.creator_id,
  });

  const { mutate: sendJoinActivity } = useMutation(
    ["join-activity"],
    () =>
      changeActivityParticipantStatus(Number(id), {
        id: Number(userInfo?.id),
        status: ActivityInviteStateEnum.CONFIRMED,
      }),
    {
      onSuccess: () => {
        enqueueSnackbar("You have successfully joined the activity", {
          variant: "success",
        });
        navigate(ApplicationLocations.ACTIVITIES);
        // setInvitedBuddies([...invitedBuddies, Number(buddy?.id)]);
      },
      onError: (error) => {
        enqueueSnackbar("Failed to join activity", { variant: "error" });
      },
    }
  );

  const handleMenuItemClick = React.useCallback(
    (action?: ActivityActionsTypeEnumDto) => {
      switch (action) {
        case ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS:
          return navigate(`${ApplicationLocations.ACTIVITY_MEMBERS}/${id}`, {
            state: {
              from: location?.pathname,
            },
          });
        case ActivityActionsTypeEnumDto.MAP:
          return navigate(`${ApplicationLocations.MAP}/${id}`, {
            state: { from: location?.pathname },
          });
        case ActivityActionsTypeEnumDto.JOIN:
          return sendJoinActivity();
        default:
          return;
      }
    },
    [sendJoinActivity, navigate]
  );

  React.useEffect(() => {
    setHeaderRightContent(
      <ActivityDetailActionMenu onMenuItemClick={handleMenuItemClick} />
    );
  }, []);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "50%",
          backgroundImage: `url(${activity?.title_picture_url})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          // backgroundImage: `linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)), url(${require("../assets/img/dune.webp")});`,
          maskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 1) 88%, transparent 100%)",
        }}
      ></Box>
      <Box
        sx={{
          width: "93%",
          margin: "auto",
        }}
      >
        <Typography variant="h2" align="left">
          {activity?.title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1.5,
          }}
        >
          <Typography variant="h5" align="left">
            Basic Information
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "grey",
            }}
          >
            {activity?.visibility === ActivityVisibilityEnum.private ? (
              <>
                <LockIcon sx={{ fontSize: "18px", mr: 0.5 }} />
                <Typography variant="subtitle1" align="left">
                  Private
                </Typography>
              </>
            ) : (
              <>
                <LockOpenIcon sx={{ fontSize: "18px", mr: 0.5 }} />
                <Typography variant="subtitle1" align="left">
                  Public
                </Typography>
              </>
            )}
          </Box>
        </Box>
        <ActivityDetailsGrid activity={activity} />
        <ActivityDescriptionTags
          description={activity?.description}
          tags={activity?.tags!}
        />
        <ActivityCreatorDuration
          creator={activityCreator}
          // duration={activity?.tags!}
          duration="3 hours"
          createdDateTime="22.01.2023 5:16 PM"
        />
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 3,
          }}
        >
          <Box>
            <Typography variant="h5" align="left" sx={{ fontSize: "14px" }}>
              Activity Creator
            </Typography>
            <Typography
              variant="subtitle1"
              align="left"
              sx={{ fontSize: "11px" }}
            >
              {activity?.creator?.name}
            </Typography>
          </Box>
          <Box>sdsdsd</Box>
        </Box> */}
      </Box>

      {/* ) : null} */}
      {/* </PageWrapper> */}
    </>
  );
};

export default ActivityDetailsScreen;
