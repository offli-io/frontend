import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import React from "react";
import BuddyItem from "../../components/buddy-item";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getActivity,
  getBuddies,
  inviteBuddy,
  kickUserFromActivity,
  uninviteBuddy,
} from "../../api/activities/requests";
import { IPerson } from "../../types/activities/activity.dto";
import { useDebounce } from "use-debounce";
import { useSnackbar } from "notistack";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { useParams } from "react-router-dom";
import { BuddyActionContent } from "./components/buddy-action-content";
import { ActivityMembersActionTypeDto } from "../../types/common/activity-members-action-type.dto";
import { IActivityRestDto } from "../../types/activities/activity-rest.dto";

// interface IActivityTypeFormProps {
//   //   onNextClicked: () => void
//   //   methods: UseFormReturn
// }

export const ActivityMembersScreen: React.FC = () => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const [invitedBuddies, setInvitedBuddies] = React.useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  //TODO change for activity hook
  const { data, isLoading } = useQuery(
    ["activity", id],
    () => getActivity<IActivityRestDto>({ id }),
    {
      enabled: !!id,
    }
  );

  const [queryString, setQueryString] = React.useState<string | undefined>();
  const [queryStringDebounced] = useDebounce(queryString, 100);

  const queryClient = useQueryClient();

  const { mutate: sendInviteBuddy } = useMutation(
    ["invite-person"],
    (values: IPerson) => inviteBuddy(String(2), values),
    {
      onSuccess: (data, variables) => {
        setInvitedBuddies([...invitedBuddies, variables?.id]);
      },
      onError: (error) => {
        enqueueSnackbar("Failed to invite user", { variant: "error" });
      },
    }
  );

  const { mutate: sendKickPersonFromActivity } = useMutation(
    ["kick-person"],
    (personId?: string) => kickUserFromActivity(String(id), String(personId)),
    {
      onSuccess: (data, variables) => {
        // setInvitedBuddies([...invitedBuddies, variables?.id])
        queryClient.invalidateQueries(["activity", id]);
      },
      onError: (error) => {
        enqueueSnackbar("Failed to kick user", { variant: "error" });
      },
    }
  );

  const { mutate: sendUninviteBuddy } = useMutation(
    ["uninvite-person"],
    (values: IPerson) => uninviteBuddy(2, Number(values?.id)),
    {
      onSuccess: (data, variables) => {
        const _buddies = invitedBuddies?.filter(
          (buddy) => buddy !== variables?.id
        );
        setInvitedBuddies(_buddies);
      },
      // onError: error => {
      //   enqueueSnackbar('Failed to create new activity', { variant: 'error' })
      // },
    }
  );

  const handleBuddyInviteClick = React.useCallback((buddy: IPerson) => {
    //fire request for invite
    if (invitedBuddies?.includes(buddy?.id)) {
      sendUninviteBuddy(buddy);
    } else {
      sendInviteBuddy(buddy);
    }
  }, []);

  //TODO now filtering is done on FE -> move to BE when capacity is available
  const activityMembers = React.useMemo(() => {
    if (queryStringDebounced) {
      return (data?.data?.activity?.participants ?? [])?.filter((participant) =>
        participant?.username
          ?.toLowerCase()
          .includes(queryStringDebounced.toLowerCase())
      );
    }
    return data?.data?.activity?.participants ?? [];
  }, [queryStringDebounced, data?.data]);

  const handleActionClick = React.useCallback(
    (type?: ActivityMembersActionTypeDto, userId?: string) => {
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

  return (
    <Box sx={{ px: 2 }}>
      <Box sx={{ display: "flex", mb: 3, mt: 2 }}>
        <Typography sx={{ fontWeight: "bold" }} variant="h4">
          Activity members
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <TextField
          // TODO idk if this is really needed and not anti-pattern
          //autoFocus
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
          sx={{ width: "100%" }}
          label="Search within activity members"
          // InputProps={{
          //   startAdornment: <SearchIcon />,
          // }}
          placeholder="Type username"
        />
        {(data?.data?.activity?.participants ?? [])?.length < 1 ? (
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
              height: 300,
              width: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              my: 3,
              borderTop: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
            }}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : (
              activityMembers.map((member) => (
                <BuddyItem
                  key={member?.id}
                  buddy={member}
                  actionContent={
                    <BuddyActionContent
                      userId={member?.id}
                      onActionClick={handleActionClick}
                    />
                  }
                />
              ))
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
