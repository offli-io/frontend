import { mdiCrown } from "@mdi/js";
import Icon from "@mdi/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomizationContext } from "assets/theme/customization-provider";
import { DrawerContext } from "assets/theme/drawer-provider";
import Loader from "components/loader";
import { format, isAfter, isWithinInterval } from "date-fns";
import {
  ACTIVITIES_QUERY_KEY,
  PAGED_ACTIVITIES_QUERY_KEY,
  useActivities,
} from "hooks/use-activities";
import { useDismissActivity } from "hooks/use-dismiss-activity";
import { PARTICIPANT_ACTIVITIES_QUERY_KEY } from "hooks/use-participant-activities";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ActivityActions from "screens/explore-screen/components/activity-actions";
import ActivityLeaveConfirmation from "screens/explore-screen/components/activity-leave-confirmation";
import { toast } from "sonner";
import { IActivity } from "types/activities/activity.dto";
import {
  addActivityToCalendar,
  changeActivityParticipantStatus,
  getActivityParticipants,
  removePersonFromActivity,
} from "../../api/activities/requests";
import { HeaderContext } from "../../app/providers/header-provider";
import userPlaceholder from "../../assets/img/user-placeholder.svg";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import OffliButton from "../../components/offli-button";
import { useGetApiUrl } from "../../hooks/use-get-api-url";
import { useGoogleAuthorization } from "../../hooks/use-google-authorization";
import { ActivityInviteStateEnum } from "../../types/activities/activity-invite-state-enum.dto";
import { ActivitiyParticipantStatusEnum as ActivityParticipantStatusEnum } from "../../types/activities/activity-participant-status-enum.dto";
import { IActivityRestDto } from "../../types/activities/activity-rest.dto";
import { ActivityVisibilityEnum } from "../../types/activities/activity-visibility-enum.dto";
import { ActivityActionsTypeEnumDto } from "../../types/common/activity-actions-type-enum.dto";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { GoogleAuthCodeFromEnumDto } from "../../types/google/google-auth-code-from-enum.dto";
import { DATE_TIME_FORMAT } from "../../utils/common-constants";
import { getTimeDifference } from "../map-screen/utils/get-time-difference";
import ActivityDetailsGrid, {
  IGridAction,
} from "./components/activity-details-grid";
import { ActivityInviteDrawerContent } from "./components/activity-invite-drawer-content";
import ActivityVisibilityDuration from "./components/activity-visibility-duration";
import { convertDateToUTC } from "./utils/convert-date-to-utc";
import ActivityActionButtons from "./components/activity-action-buttons";
import ImagePreviewModal from "components/image-preview-modal/image-preview-modal";
import { useActivityParticipants } from "hooks/use-activity-participants";

interface IProps {
  type: "detail" | "request";
}

interface ICustomizedLocationState {
  openInviteDrawer?: boolean;
}

const ActivityDetailsScreen: React.FC<IProps> = ({ type }) => {
  const { id } = useParams();
  const { mode } = React.useContext(CustomizationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const shouldOpenInviteDrawer =
    (location?.state as ICustomizedLocationState)?.openInviteDrawer ?? false;
  const { toggleDrawer } = React.useContext(DrawerContext);
  const { setHeaderRightContent, headerRightContent } =
    React.useContext(HeaderContext);
  const { userInfo } = React.useContext(AuthenticationContext);
  const { sendDismissActivity, isLoading: isDismissingActivity } =
    useDismissActivity({
      onSuccess: () => {
        queryClient.invalidateQueries(["paged-activities"]);
        queryClient.invalidateQueries(["activity", id]);
        queryClient.invalidateQueries(["activity-participants", id]);
        queryClient.invalidateQueries([ACTIVITIES_QUERY_KEY]);
        queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);
        navigate(ApplicationLocations.EXPLORE);
      },
    });
  const queryClient = useQueryClient();
  const baseUrl = useGetApiUrl();
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const { shadows, palette } = useTheme();
  const [imagePreviewModalOpen, setImagePreviewModalOpen] =
    React.useState(false);

  const { googleToken, handleGoogleAuthorization, state } =
    useGoogleAuthorization({
      from: GoogleAuthCodeFromEnumDto.ACTIVITY_DETAIL,
      state: JSON.stringify({ id }),
    });

  const { data: { data: { activity = undefined } = {} } = {}, isLoading } =
    useActivities<IActivityRestDto>({
      params: {
        id: id ? Number(id) : undefined,
        participantId: userInfo?.id,
      },
    });

  const {
    data: { data: { participants = null } = {} } = {},
    isLoading: areActivityParticipantsLoading,
  } = useActivityParticipants({ params: { id } });

  const { mutate: sendLeaveActivity, isLoading: isLeavingActivity } =
    useMutation(
      ["leave-activity"],
      (activityId?: number) =>
        removePersonFromActivity({ activityId, personId: userInfo?.id }),
      {
        onSuccess: (data, activityId) => {
          hideDrawer();
          //TODO add generic jnaming for activites / activity
          queryClient.invalidateQueries(["activity", activityId]);
          queryClient.invalidateQueries([ACTIVITIES_QUERY_KEY]);
          queryClient.invalidateQueries([PAGED_ACTIVITIES_QUERY_KEY]);
          queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);

          toast.success("You have successfully left the activity");
          //invalidate queries
          //TODO display success notification?
        },
        onError: () => {
          toast.error("Failed to leave activity");
        },
      }
    );

  const { mutate: sendJoinActivity, isLoading: isJoiningActivity } =
    useMutation(
      ["join-activity"],
      () =>
        changeActivityParticipantStatus(Number(id), Number(userInfo?.id), {
          status: ActivityInviteStateEnum.CONFIRMED,
        }),
      {
        onSuccess: () => {
          toast.success("You have successfully joined the activity");
          hideDrawer();
          queryClient.invalidateQueries(["paged-activities"]);
          queryClient.invalidateQueries(["activity", id]);
          queryClient.invalidateQueries(["activity-participants", id]);
          queryClient.invalidateQueries([ACTIVITIES_QUERY_KEY]);
          queryClient.invalidateQueries([PARTICIPANT_ACTIVITIES_QUERY_KEY]);

          // setInvitedBuddies([...invitedBuddies, Number(buddy?.id)]);
        },
        onError: (error) => {
          toast.error("Failed to join activity");
        },
      }
    );

  const { mutate: sendAddActivityToCalendar } = useMutation(
    ["add-event-to-calendar"],
    (token: string) => {
      abortControllerRef.current = new AbortController();

      const start = convertDateToUTC(activity?.datetime_from as string);
      const end = convertDateToUTC(activity?.datetime_until as string);

      return addActivityToCalendar(
        Number(userInfo?.id),
        {
          name: activity?.title as string,
          start,
          end,
          token: token as string,
        },
        abortControllerRef?.current?.signal
      );
    },
    {
      onSuccess: () => {
        toast.success(
          "Activity has been successfully added to your Google calendar"
        );
      },
      onError: (error) => {
        toast.error("Failed to join activity");
      },
    }
  );

  React.useEffect(() => {
    if (googleToken && activity) {
      sendAddActivityToCalendar(googleToken);
    }
  }, [googleToken, activity]);

  const hideDrawer = React.useCallback(() => {
    return toggleDrawer({
      open: false,
      content: undefined,
    });
  }, [toggleDrawer]);

  const handleMenuItemClick = React.useCallback(
    (action?: ActivityActionsTypeEnumDto) => {
      switch (action) {
        case ActivityActionsTypeEnumDto.ACTIVITY_MEMBERS:
          return navigate(`${ApplicationLocations.ACTIVITY_MEMBERS}/${id}`, {
            state: undefined,
          });
        case ActivityActionsTypeEnumDto.MAP:
          return navigate(`${ApplicationLocations.MAP}/${id}`, {
            state: undefined,
          });
        case ActivityActionsTypeEnumDto.JOIN:
          return sendJoinActivity();
        case ActivityActionsTypeEnumDto.EDIT:
          //TODO EditActivityScreen pass id?
          return navigate(`${ApplicationLocations.EDIT_ACTIVITY}/${id}`, {
            state: undefined,
          });
        case ActivityActionsTypeEnumDto.LEAVE:
          //TODO EditActivityScreen pass id?
          return toggleDrawer({
            open: true,
            content: (
              <ActivityLeaveConfirmation
                activityId={Number(id)}
                onLeaveCancel={hideDrawer}
                onLeaveConfirm={sendLeaveActivity}
                isLeaving={isLeavingActivity}
              />
            ),
          });
        case ActivityActionsTypeEnumDto.DISMISS:
          return toggleDrawer({
            open: true,
            content: (
              <ActivityLeaveConfirmation
                activityId={Number(id)}
                onLeaveCancel={hideDrawer}
                onLeaveConfirm={sendDismissActivity}
                isLeaving={isLeavingActivity}
                type="dismiss"
              />
            ),
          });
        default:
          return;
      }
    },
    [sendJoinActivity, navigate, id]
  );

  const handleActivityActionsCLick = React.useCallback(
    (activity?: IActivity) => {
      toggleDrawer({
        open: true,
        content: (
          <ActivityActions
            activity={activity}
            onActionClick={handleMenuItemClick}
          />
        ),
      });
    },
    [toggleDrawer, handleMenuItemClick]
  );

  React.useEffect(() => {
    setHeaderRightContent(
      <IconButton
        color="primary"
        data-testid="toggle-activity-menu-btn"
        onClick={() => handleActivityActionsCLick(activity)}
      >
        <MenuIcon />
      </IconButton>
    );
  }, [activity, handleActivityActionsCLick, setHeaderRightContent]);

  React.useEffect(() => {
    if (state) {
      navigate(`${ApplicationLocations.ACTIVITY_DETAIL}/${state?.id}`, {
        state: { from: ApplicationLocations.EXPLORE },
      });
    }
  }, [state]);

  React.useEffect(() => {
    if (shouldOpenInviteDrawer) {
      toggleDrawer({
        open: true,
        content: <ActivityInviteDrawerContent activityId={Number(id)} />,
      });
    }
  }, [shouldOpenInviteDrawer, id]);

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

  const displayActionButtons =
    activity?.visibility === ActivityVisibilityEnum.public;

  const isAlreadyParticipant = React.useMemo(
    () =>
      !!activity &&
      activity?.participant_status === ActivityParticipantStatusEnum.CONFIRMED,

    [activity]
  );

  const isPastActivity =
    !!activity?.datetime_until &&
    isAfter(new Date(), new Date(activity.datetime_until));

  const isInProgress =
    !!activity?.datetime_from &&
    !!activity?.datetime_until &&
    isWithinInterval(new Date(), {
      start: new Date(activity?.datetime_from),
      end: new Date(activity?.datetime_until),
    });

  const isCreator = activity?.creator?.id === userInfo?.id;

  const dateTimeFrom = activity?.datetime_from
    ? new Date(activity?.datetime_from)
    : null;

  const dateTimeUntil = activity?.datetime_until
    ? new Date(activity?.datetime_until)
    : null;

  const {
    durationHours = 0,
    durationMinutes = 0,
    durationDays = 0,
  } = getTimeDifference(dateTimeFrom, dateTimeUntil) ?? {}; // useMemo??

  const privateUninvitedActivity =
    activity?.visibility === ActivityVisibilityEnum.private &&
    !activity?.participant_status;

  const handleJoinButtonClick = React.useCallback(() => {
    isAlreadyParticipant
      ? isCreator
        ? toggleDrawer({
            open: true,
            content: (
              <ActivityLeaveConfirmation
                activityId={Number(id)}
                onLeaveCancel={hideDrawer}
                onLeaveConfirm={sendDismissActivity}
                isLeaving={isLeavingActivity}
                type="dismiss"
              />
            ),
          })
        : sendLeaveActivity(Number(id))
      : sendJoinActivity();
  }, [isAlreadyParticipant, isCreator, id]);

  const areActionsLoading = isLeavingActivity || isJoiningActivity;

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <ImagePreviewModal
        imageSrc={`${baseUrl}/files/${activity?.title_picture}`}
        open={imagePreviewModalOpen}
        onClose={() => setImagePreviewModalOpen(false)}
      />

      <Box
        sx={{
          width: "100%",
          height: "50%",
          backgroundImage: `url(${baseUrl}/files/${activity?.title_picture})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        onClick={() => setImagePreviewModalOpen(true)}
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
            variant="h1"
            align="center"
            sx={{
              ml: 1,
              mr: 1,
              overflow: "hidden",
              wordWrap: "break-word",
              // filter: "invert(100%)",
              textShadow: ({ palette }) => `1px 0px 1px black`,
              ...(mode === "light" ? { filter: "invert(100%)" } : {}),
              ...(mode === "light"
                ? {
                    textShadow: ({ palette }) =>
                      `1px 1px 1px ${palette?.primary?.light}`,
                  }
                : {}),
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
        <ActivityActionButtons
          onJoinClick={handleJoinButtonClick}
          areActionsLoading={areActionsLoading}
          isCreator={isCreator}
          isAlreadyParticipant={isAlreadyParticipant}
          isPublic={activity?.visibility === ActivityVisibilityEnum.public}
          hasEnded={isPastActivity}
          inProgress={isInProgress}
          privateUninvitedActivity={privateUninvitedActivity}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 2,
            // gap: 18,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              maxWidth: "70%",
            }}
            onClick={() => {
              if (activity?.creator?.id !== userInfo?.id) {
                navigate(
                  `${ApplicationLocations.USER_PROFILE}/${activity?.creator?.id}`
                );
              }
            }}
          >
            <Box sx={{ position: "relative" }}>
              <img
                src={
                  activity?.creator?.profile_photo
                    ? `${baseUrl}/files/${activity?.creator?.profile_photo}`
                    : userPlaceholder
                }
                alt="profile"
                style={{
                  height: 40,
                  width: 40,
                  aspectRatio: 1,
                  borderRadius: "50%",
                  borderWidth: "2px",
                  borderColor: palette?.primary?.main,
                  borderStyle: "solid",
                  margin: 1,
                }}
              />
              <Icon
                path={mdiCrown}
                size={0.8}
                style={{
                  position: "absolute",
                  left: -4,
                  top: -7,
                  fontSize: 12,
                  color: palette?.primary?.main,
                  border: "0.5px solid palette?.background?.default",
                  borderRadius: "50%",
                  backgroundColor: palette?.background?.default,
                  // boxShadow: shadows[1],
                }}
              />
            </Box>

            <Typography
              sx={{
                ml: 1,
                fontSize: 16,
                // fontWeight: "bold",
                color: ({ palette }) => palette?.text?.primary,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {activity?.creator?.username}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {activity?.visibility === ActivityVisibilityEnum.private ? (
              <LockIcon sx={{ fontSize: 20 }} />
            ) : (
              <LockOpenIcon sx={{ fontSize: 20 }} />
            )}
            <Typography
              variant="h6"
              align="left"
              sx={{
                ml: 0.5,
              }}
            >
              {activity?.visibility}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h4" sx={{ mt: 1.5 }}>
          Basic information
        </Typography>

        <ActivityDetailsGrid
          activity={activity}
          onActionClick={handleGridClick}
        />

        <ActivityVisibilityDuration
          description={activity?.description}
          duration={`${
            durationDays > 0
              ? `${durationDays} ${durationDays === 1 ? "day" : "days"}`
              : ""
          } ${
            durationHours > 0
              ? `${durationHours} ${durationHours === 1 ? "hour" : "hours"}`
              : ""
          } ${
            durationMinutes > 0
              ? `${durationMinutes} ${
                  durationMinutes === 1 ? "minute" : "minutes"
                }`
              : ""
          }`}
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
