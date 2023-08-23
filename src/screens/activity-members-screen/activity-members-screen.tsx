import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Chip,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import {
  getActivityParticipants,
  kickUserFromActivity,
} from "../../api/activities/requests";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import BuddyItem from "../../components/buddy-item";
import { useActivities } from "../../hooks/use-activities";
import { IActivityRestDto } from "../../types/activities/activity-rest.dto";
import { ActivityMembersActionTypeDto } from "../../types/common/activity-members-action-type.dto";
import { BuddyActionContent } from "./components/buddy-action-content";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import BuddyItemInvite from "../../components/buddy-item-invite";
import { IParticipantDto } from "../../types/activities/list-participants-response.dto";
import { ActivitiyParticipantStatusEnum } from "../../types/activities/activity-participant-status-enum.dto";
import StarIcon from "@mui/icons-material/Star";
import { DrawerContext } from "../../assets/theme/drawer-provider";

export const ActivityMembersScreen: React.FC = () => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const [invitedBuddies, setInvitedBuddies] = React.useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleDrawer } = React.useContext(DrawerContext);
  const { pathname } = useLocation();

  const { data: { data: { activity = {} } = {} } = {}, isLoading } =
    useActivities<IActivityRestDto>({
      id: id ? Number(id) : undefined,
    });

  const {
    data: { data: { participants = [] } = {} } = {},
    isLoading: areActivityParticipantsLoading,
  } = useQuery(
    ["activity-participants", id],
    () => getActivityParticipants({ activityId: Number(id) }),
    {
      enabled: !!id,
      // sort to have creator on the top
      select: (data) => ({
        ...data,
        data: {
          ...data?.data,
          participants: [
            ...data?.data?.participants?.sort((participant) =>
              participant?.id === activity?.creator?.id ? -1 : 1
            ),
          ],
        },
      }),
    }
  );

  const [queryString, setQueryString] = React.useState<string | undefined>();
  const [queryStringDebounced] = useDebounce(queryString, 100);

  const queryClient = useQueryClient();

  const { mutate: sendKickPersonFromActivity } = useMutation(
    ["kick-person"],
    (personId?: number) => kickUserFromActivity(Number(id), Number(personId)),
    {
      onSuccess: (data, variables) => {
        enqueueSnackbar("User has been successfully kicked from activity", {
          variant: "success",
        });
        queryClient.invalidateQueries(["activity-participants", id]);
        queryClient.invalidateQueries(["activity", id]);
        toggleDrawer({ open: false });
      },
      onError: (error) => {
        enqueueSnackbar("Failed to kick user", { variant: "error" });
      },
    }
  );

  //TODO now filtering is done on FE -> move to BE when capacity is available
  const activityMembers = React.useMemo(() => {
    if (queryStringDebounced) {
      return participants?.filter((participant) =>
        participant?.username
          ?.toLowerCase()
          .includes(queryStringDebounced.toLowerCase())
      );
    }
    return participants;
  }, [queryStringDebounced, activity, participants]);

  const handleActionClick = React.useCallback(
    (type?: ActivityMembersActionTypeDto, userId?: number) => {
      switch (type) {
        case ActivityMembersActionTypeDto.KICK:
          return sendKickPersonFromActivity(userId);
        case ActivityMembersActionTypeDto.PROMOTE:
          return console.log("call promote with id");
        default:
          return;
      }
    },
    []
  );

  const isCreator = React.useMemo(
    () => activity?.creator?.id === userInfo?.id,
    [activity, userInfo?.id]
  );
  const anySearchResults = [...(activityMembers ?? [])]?.length > 0;

  const generateChipLabel = React.useCallback(() => {}, []);

  const renderActionContent = React.useCallback(
    (member: IParticipantDto): React.ReactNode => {
      // if creator is opening "Activity members"
      if (isCreator && member?.id !== userInfo?.id) {
        return (
          <BuddyActionContent
            userId={member?.id}
            userStatus={member?.status}
            onActionClick={handleActionClick}
          />
        );
      } else if (member?.status !== ActivitiyParticipantStatusEnum.CONFIRMED) {
        return (
          <Chip
            label={
              member?.status === ActivitiyParticipantStatusEnum.INVITED
                ? "Invited"
                : "Rejected"
            }
            sx={{
              ml: 1,
              bgcolor: ({ palette }) =>
                member?.status === ActivitiyParticipantStatusEnum.INVITED
                  ? palette?.primary?.light
                  : palette?.error?.main,
              color: ({ palette }) => palette?.primary?.main,
            }}
          />
        );
      } else if (
        member?.status === ActivitiyParticipantStatusEnum.CONFIRMED &&
        member?.id === activity?.creator?.id
      ) {
        return (
          <Chip
            label="Creator"
            sx={{
              ml: 1,
              px: 0.5,
              bgcolor: ({ palette }) => palette?.primary?.light,
              color: ({ palette }) => palette?.primary?.main,
            }}
            icon={<StarIcon color="primary" sx={{ fontSize: 18 }} />}
          />
        );
      } else {
        return null;
      }
    },
    [userInfo?.id, handleActionClick, activity, isCreator]
  );

  return (
    <Box sx={{ px: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
          mt: 2,
        }}
      >
        <TextField
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
          // label="Search among activity members"
          placeholder="Search among activity members"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: "1.5rem", color: "#4A148C" }} />{" "}
              </InputAdornment>
            ),
          }}
          sx={{
            width: "100%",
            "& input::placeholder": {
              fontSize: 14,
              color: "#4A148C",
              fontWeight: "bold",
              opacity: 1,
              pl: 1,
            },
            "& fieldset": { border: "none" },
            backgroundColor: ({ palette }) => palette?.primary?.light,
            borderRadius: "10px",
          }}
          data-testid="activities-search-input"
        />
        {(activity?.count_confirmed ?? 0) < 1 ? (
          <Box
            sx={{
              height: 100,
              width: "100%",
              my: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderTop: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
            }}
          >
            <Typography sx={{ color: (theme) => theme.palette.inactive.main }}>
              No activity members
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              my: 3,
              py: 3,
              borderTop: "1px solid lightgrey",
              borderBottom: anySearchResults ? "1px solid lightgrey" : "unset",
            }}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : anySearchResults ? (
              activityMembers.map((member) => (
                <BuddyItem
                  key={member?.id}
                  buddy={member}
                  actionContent={renderActionContent(member)}
                  onClick={() =>
                    navigate(
                      `${ApplicationLocations.USER_PROFILE}/${member?.id}`,
                      {
                        state: {
                          from: pathname,
                        },
                      }
                    )
                  }
                />
              ))
            ) : (
              // <Box sx={{ display: 'flex', alignItems: 'center'}}>
              <Typography
                variant="subtitle2"
                sx={{ textAlign: "center", my: 4 }}
              >
                No members found
              </Typography>
              // </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
