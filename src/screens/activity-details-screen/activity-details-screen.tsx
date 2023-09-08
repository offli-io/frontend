import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MenuIcon from "@mui/icons-material/Menu";

import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  addActivityToCalendar,
  changeActivityParticipantStatus,
  getActivity,
  getActivityParticipants,
} from "../../api/activities/requests";
import { HeaderContext } from "../../app/providers/header-provider";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { useGoogleAuthorization } from "../../hooks/use-google-authorization";
import { useUser } from "../../hooks/use-user";
import { ActivityInviteStateEnum } from "../../types/activities/activity-invite-state-enum.dto";
import { IActivityRestDto } from "../../types/activities/activity-rest.dto";
import { ActivityVisibilityEnum } from "../../types/activities/activity-visibility-enum.dto";
import { ActivityActionsTypeEnumDto } from "../../types/common/activity-actions-type-enum.dto";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { ICustomizedLocationStateDto } from "../../types/common/customized-location-state.dto";
import { GoogleAuthCodeFromEnumDto } from "../../types/google/google-auth-code-from-enum.dto";
import ActivityDetailActionMenu from "./components/acitivity-detail-action-menu";
import ActivityCreatorDuration from "./components/activity-visibility-duration";
import ActivityDetailsGrid, {
  IGridAction,
} from "./components/activity-details-grid";
import { convertDateToUTC } from "./utils/convert-date-to-utc";
import OffliButton from "../../components/offli-button";
import { IParticipantDto } from "../../types/activities/list-participants-response.dto";
import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "../../utils/common-constants";
import { getTimeDifference } from "../map-screen/utils/get-time-difference";
import { useGetApiUrl } from "../../hooks/use-get-api-url";
import { ActivitiyParticipantStatusEnum } from "../../types/activities/activity-participant-status-enum.dto";
import { DrawerContext } from "assets/theme/drawer-provider";
import ActivityActions from "screens/my-activities-screen/components/activity-actions";
import { PARTICIPANT_ACTIVITIES_QUERY_KEY } from "hooks/use-participant-activities";
import { ACTIVITIES_QUERY_KEY, useActivities } from "hooks/use-activities";
import userPlaceholder from "../../assets/img/user-placeholder.svg";
import Icon from "@mdi/react";
import { mdiCrown } from "@mdi/js";
import ActivityVisibilityDuration from "./components/activity-visibility-duration";

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
  const { toggleDrawer } = React.useContext(DrawerContext);
  const { setHeaderRightContent, headerRightContent } =
    React.useContext(HeaderContext);
  const { userInfo } = React.useContext(AuthenticationContext);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const baseUrl = useGetApiUrl();
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const { shadows, palette } = useTheme();

  const { googleToken, handleGoogleAuthorization, state } =
    useGoogleAuthorization({
      from: GoogleAuthCodeFromEnumDto.ACTIVITY_DETAIL,
      state: JSON.stringify({ id }),
    });

  const { data, isLoading } = useActivities<IActivityRestDto>({
    id: id ? Number(id) : undefined,
    participantId: userInfo?.id,
  });

  // const { data } = useQuery(
  //   ["activity", id],
  //   () => getActivity<IActivityRestDto>({ id: Number(id) }),
  //   {
  //     enabled: !!id,
  //   }
  // );

  const {
    data: { data: { participants = null } = {} } = {},
    isLoading: areActivityParticipantsLoading,
  } = useQuery(
    ["activity-participants", id],
    () => getActivityParticipants({ activityId: Number(id) }),
    {
      enabled: !!id,
    }
  );

  const activity = data?.data?.activity;

  const { mutate: sendJoinActivity, isLoading: isJoiningActivity } =
    useMutation(
      ["join-activity"],
      () =>
        changeActivityParticipantStatus(Number(id), Number(userInfo?.id), {
          status: ActivityInviteStateEnum.CONFIRMED,
        }),
      {
        onSuccess: () => {
          enqueueSnackbar("You have successfully joined the activity", {
            variant: "success",
          });
          navigate(ApplicationLocations.ACTIVITIES);
          queryClient.invalidateQueries(["paged-activities"]);
          queryClient.invalidateQueries(["activity", id]);
          queryClient.invalidateQueries(["activity-participants", id]);
          queryClient.invalidateQueries([ACTIVITIES_QUERY_KEY]);
          queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);

          // setInvitedBuddies([...invitedBuddies, Number(buddy?.id)]);
        },
        onError: (error) => {
          enqueueSnackbar("Failed to join activity", { variant: "error" });
        },
      }
    );

  const { mutate: sendAddActivityToCalendar } = useMutation(
    ["add-event-to-calendar"],
    (token: string) => {
      abortControllerRef.current = new AbortController();

      const start = convertDateToUTC(
        data?.data?.activity?.datetime_from as string
      );
      const end = convertDateToUTC(
        data?.data?.activity?.datetime_until as string
      );

      return addActivityToCalendar(
        Number(userInfo?.id),
        {
          name: data?.data?.activity?.title as string,
          start,
          end,
          token: token as string,
        },
        abortControllerRef?.current?.signal
      );
    },
    {
      onSuccess: () => {
        enqueueSnackbar(
          "Activity has been successfully added to your Google calendar",
          {
            variant: "success",
          }
        );
      },
      onError: (error) => {
        enqueueSnackbar("Failed to join activity", { variant: "error" });
      },
    }
  );

  React.useEffect(() => {
    if (googleToken && data?.data?.activity) {
      sendAddActivityToCalendar(googleToken);
    }
  }, [googleToken, data?.data?.activity]);

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

  const handleActivityActionsCLick = React.useCallback(() => {
    toggleDrawer({
      open: true,
      content: (
        <ActivityActions
          activity={data?.data?.activity}
          onActionClick={handleMenuItemClick}
        />
      ),
    });
  }, [toggleDrawer, handleMenuItemClick, activity]);

  React.useEffect(() => {
    //TODO this runs on every re-render but with dependencies (they wont change on page refresh)
    if (!headerRightContent) {
      setHeaderRightContent(
        <IconButton
          // aria-describedby={id}
          color="primary"
          data-testid="toggle-activity-menu-btn"
          onClick={handleActivityActionsCLick}
        >
          <MenuIcon />
        </IconButton>
        // <ActivityDetailActionMenu onMenuItemClick={handleMenuItemClick} />
      );
    }
  });

  React.useEffect(() => {
    if (state) {
      navigate(`${ApplicationLocations.ACTIVITY_DETAIL}/${state?.id}`, {
        state: { from: ApplicationLocations.ACTIVITIES },
      });
    }
  }, [state]);

  const handleGridClick = React.useCallback(
    (action: IGridAction) => {
      switch (action) {
        case IGridAction.GOOGLE_CALENDAR:
          return handleGoogleAuthorization();
        default:
          return;
      }
    },
    [handleGoogleAuthorization]
  );

  const displayJoinButton = React.useMemo(
    () =>
      (activity?.visibility === ActivityVisibilityEnum.public &&
        activity?.participant_status === null) ||
      (!!participants &&
        participants?.some(
          ({ id, status }: IParticipantDto) =>
            id === userInfo?.id &&
            status === ActivitiyParticipantStatusEnum.INVITED
        )),
    [participants, userInfo?.id, activity]
  );

  const dateTimeFrom = activity?.datetime_from
    ? new Date(activity?.datetime_from)
    : null;

  const dateTimeUntil = activity?.datetime_until
    ? new Date(activity?.datetime_until)
    : null;

  const timeDifference = getTimeDifference(dateTimeFrom, dateTimeUntil); // useMemo??

  const durationMinutes = timeDifference?.durationMinutes;
  const durationHours = timeDifference?.durationHours;

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "50%",
          backgroundImage: `url(${baseUrl}/files/${activity?.title_picture})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          // backgroundImage: `linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)), url(${require("../assets/img/dune.webp")});`,
          // maskImage:
          //   "linear-gradient(to bottom, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0.2))",
          // maskImage: "linear-gradient(to top, transparent 0%, white 75%)",

          // background:
          //   "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "flex-end",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))",
            px: 1,
            pb: 1,
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h2"
            align="left"
            sx={{
              overflow: "hidden",
              wordWrap: "break-word",
              filter: "invert(100%)",
              textShadow: ({ palette }) => `1px 0px 1px black`,
            }}
          >
            {activity?.title}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: "93%",
          margin: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 1.5,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", position: "relative" }}
          >
            <img
              src={
                activity?.creator?.profile_photo
                  ? `${baseUrl}/files/${activity?.creator?.profile_photo}`
                  : userPlaceholder
              }
              alt="profile"
              style={{
                height: 35,
                aspectRatio: 1,
                borderRadius: "50%",
                boxShadow: shadows?.[2],
                margin: 1,
                position: "relative",
              }}
            />
            <Icon
              path={mdiCrown}
              size={0.8}
              style={{
                position: "absolute",
                left: -4,
                top: -6,
                fontSize: 12,
                color: palette?.primary?.main,
                // boxShadow: shadows[1],
              }}
            />

            <Typography sx={{ ml: 1, fontSize: 16 }}>
              {activity?.creator?.username}
            </Typography>
          </Box>
          {displayJoinButton ? (
            <OffliButton
              size="small"
              sx={{ fontSize: 16, width: "30%" }}
              onClick={() => sendJoinActivity()}
              isLoading={isJoiningActivity}
            >
              Join
            </OffliButton>
          ) : null}
        </Box>
        <ActivityDetailsGrid
          activity={activity}
          onActionClick={handleGridClick}
        />
        {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">Duration</Typography>
          <Typography>
            {`${durationHours} hours, ${durationMinutes} minutes`}
          </Typography>
        </Box> */}

        <ActivityVisibilityDuration
          visibility={
            data?.data?.activity?.visibility as ActivityVisibilityEnum
          }
          // duration={activity?.tags!}
          duration={`${durationHours} hours, ${durationMinutes} minutes`}
          createdDateTime={
            activity?.created_at
              ? format(new Date(activity?.created_at), DATE_TIME_FORMAT)
              : "-"
          }
          tags={activity?.tags!}
        />
      </Box>
    </>
  );
};

export default ActivityDetailsScreen;
