import { mdiCrown } from "@mdi/js";
import Icon from "@mdi/react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import {
  getActivityParticipants,
  kickUserFromActivity,
  uninviteBuddy,
} from "../../api/activities/requests";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { DrawerContext } from "../../assets/theme/drawer-provider";
import BuddyItem from "../../components/buddy-item";
import { useActivities } from "../../hooks/use-activities";
import { ActivitiyParticipantStatusEnum } from "../../types/activities/activity-participant-status-enum.dto";
import { IActivityRestDto } from "../../types/activities/activity-rest.dto";
import { IParticipantDto } from "../../types/activities/list-participants-response.dto";
import { ActivityMembersActionTypeDto } from "../../types/common/activity-members-action-type.dto";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { BuddyActionContent } from "./components/buddy-action-content";
import SearchBuddiesContent from "./components/search-buddies-content";
import { isAfter } from "date-fns";

enum ITabs {
  CONFIRMED = "CONFIRMED",
  INVITED = "INVITED",
}

export const ActivityMembersScreen: React.FC = () => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const [invitedBuddies, setInvitedBuddies] = React.useState<string[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleDrawer } = React.useContext(DrawerContext);
  const { pathname } = useLocation();
  const { palette } = useTheme();
  const [activeTab, setActiveTab] = React.useState<ITabs>(ITabs.CONFIRMED);

  const handlers = useSwipeable({
    onSwipedRight: () =>
      activeTab === ITabs.INVITED && setActiveTab(ITabs.CONFIRMED),
    onSwipedLeft: () =>
      activeTab === ITabs.CONFIRMED && setActiveTab(ITabs.INVITED),
  });

  const { data: { data: { activity = {} } = {} } = {}, isLoading } =
    useActivities<IActivityRestDto>({
      params: {
        id: id ? Number(id) : undefined,
      },
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
        toggleDrawer({ open: false });
        toast.success("User has been successfully kicked from activity");
        queryClient.invalidateQueries(["activity-participants", id]);
        queryClient.invalidateQueries(["activity", id]);
      },
      onError: (error) => {
        toast.error("Failed to kick user");
      },
    }
  );

  const { mutate: sendUninviteBuddy, isLoading: isUninviting } = useMutation(
    ["uninvite-person"],
    (buddyId?: number) => uninviteBuddy(Number(id), Number(buddyId)),
    {
      onSuccess: (data, buddyId) => {
        toggleDrawer({ open: false });

        queryClient.invalidateQueries(["activity-participants"]);
        // const _buddies = invitedBuddies?.filter((buddy) => buddy !== buddyId);
        // setInvitedBuddies(_buddies);
      },
      onError: (error) => {
        toast.error("Failed to cancel invite for user");
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
    return participants?.filter((participant) =>
      activeTab === ITabs.CONFIRMED
        ? participant?.status === ActivitiyParticipantStatusEnum.CONFIRMED
        : participant?.status === ActivitiyParticipantStatusEnum.INVITED
    );
  }, [queryStringDebounced, activity, participants, activeTab]);

  const handleActionClick = React.useCallback(
    (type?: ActivityMembersActionTypeDto, userId?: number) => {
      switch (type) {
        case ActivityMembersActionTypeDto.KICK:
          return sendKickPersonFromActivity(userId);
        case ActivityMembersActionTypeDto.PROMOTE:
          return console.log("call promote with id");
        case ActivityMembersActionTypeDto.UNINVITE:
          return sendUninviteBuddy(userId);
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
  const isPastActivity =
    !!activity?.datetime_until &&
    isAfter(new Date(), new Date(activity.datetime_until));
  const anySearchResults = [...(activityMembers ?? [])]?.length > 0;

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
            icon={
              <Icon
                path={mdiCrown}
                size={0.8}
                style={{
                  color: palette?.primary?.main,
                  // boxShadow: shadows[1],
                }}
              />
            }
            // <StarIcon color="primary" sx={{ fontSize: 18 }} />}
          />
        );
      } else {
        return null;
      }
    },
    [userInfo?.id, handleActionClick, activity, isCreator]
  );

  const handleAddBuddies = React.useCallback(() => {
    //TODO how to display invite button??
    toggleDrawer({
      open: true,
      content: <SearchBuddiesContent activityId={Number(id)} />,
    });
  }, [toggleDrawer, id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: ITabs) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ px: 2, height: "100%" }} {...handlers}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
          mt: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "sticky",
            bgcolor: ({ palette }) => palette?.background?.default,
            top: 2,
            // pt: 2,
            // pt: 4,
            py: 1.5,
            zIndex: 555,
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
          {isCreator ? (
            <IconButton
              color="primary"
              sx={{ fontSize: 14, ml: 1 }}
              onClick={handleAddBuddies}
              disabled={isPastActivity}
            >
              <PersonAddIcon sx={{ color: "inherit" }} />
            </IconButton>
          ) : null}
        </Box>

        <Box sx={{ width: "100%" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            variant="fullWidth"
            sx={{ 
              '& .MuiTab-root': {
              textTransform: 'capitalize',
              fontSize: 16
              }, }}
          >
            <Tab label="Confirmed" value={ITabs.CONFIRMED} />
            <Tab label="Invited" value={ITabs.INVITED} />
          </Tabs>
          {(activity?.count_confirmed ?? 0) < 1 ? (
            <Box
              sx={{
                height: 100,
                width: "100%",
                my: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // borderTop: "1px solid lightgrey",
                // borderBottom: "1px solid lightgrey",
              }}
            >
              <Typography
                sx={{ color: (theme) => theme.palette.inactive.main }}
              >
                No activity members
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                mt: 1,
                pb: 3,
                // borderTop: "1px solid lightgrey",
                // borderBottom: anySearchResults
                //   ? "1px solid lightgrey"
                //   : "unset",
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
                    actionContent={
                      !isPastActivity && renderActionContent(member)
                    }
                    onClick={() =>
                      member?.id !== userInfo?.id &&
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
    </Box>
  );
};
