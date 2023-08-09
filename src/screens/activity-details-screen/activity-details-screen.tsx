import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Box, Typography } from "@mui/material";
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
import ActivityCreatorDuration from "./components/activity-creator-duration";
import ActivityDescriptionTags from "./components/activity-description-tags";
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
  const queryClient = useQueryClient();
  const baseUrl = useGetApiUrl();
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const { googleToken, handleGoogleAuthorization, state } =
    useGoogleAuthorization({
      from: GoogleAuthCodeFromEnumDto.ACTIVITY_DETAIL,
      state: JSON.stringify({ id }),
    });

  const { data } = useQuery(
    ["activity", id],
    () => getActivity<IActivityRestDto>({ id: Number(id) }),
    {
      enabled: !!id,
    }
  );

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
          queryClient.invalidateQueries(["activities"]);
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

  React.useEffect(() => {
    setHeaderRightContent(
      <ActivityDetailActionMenu onMenuItemClick={handleMenuItemClick} />
    );
  }, [handleMenuItemClick, setHeaderRightContent]);

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
      !!participants &&
      participants?.some(
        ({ id, status }: IParticipantDto) =>
          id === userInfo?.id &&
          status === ActivitiyParticipantStatusEnum.INVITED
      ),
    [participants, userInfo?.id]
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
        <Typography
          variant="h2"
          align="left"
          sx={{ overflow: "hidden", wordWrap: "break-word" }}
        >
          {activity?.title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 1.5,
          }}
        >
          <Typography variant="h5" align="left">
            Basic Information
          </Typography>
          {/* <Box
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
          </Box> */}
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
        <ActivityDescriptionTags
          description={activity?.description}
          tags={activity?.tags!}
        />
        <ActivityCreatorDuration
          creator={data?.data?.activity?.creator}
          // duration={activity?.tags!}
          duration={`${durationHours} hours, ${durationMinutes} minutes`}
          createdDateTime={
            activity?.created_at
              ? format(new Date(activity?.created_at), DATE_TIME_FORMAT)
              : "-"
          }
        />
      </Box>
    </>
  );
};

export default ActivityDetailsScreen;
