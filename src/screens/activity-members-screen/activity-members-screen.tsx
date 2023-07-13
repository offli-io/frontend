import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { useParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import {
  getActivity,
  getActivityParticipants,
  kickUserFromActivity,
} from "../../api/activities/requests";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import BuddyItem from "../../components/buddy-item";
import { IActivityRestDto } from "../../types/activities/activity-rest.dto";
import { ActivityMembersActionTypeDto } from "../../types/common/activity-members-action-type.dto";
import { BuddyActionContent } from "./components/buddy-action-content";

export const ActivityMembersScreen: React.FC = () => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const [invitedBuddies, setInvitedBuddies] = React.useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  //TODO change for activity hook
  const { data, isLoading } = useQuery(
    ["activity", id],
    () => getActivity<IActivityRestDto>({ id: Number(id) }),
    {
      enabled: !!id,
    }
  );
  const {
    data: { data: { participants = [] } = {} } = {},
    isLoading: areActivityParticipantsLoading,
  } = useQuery(
    ["activity-participants", id],
    () => getActivityParticipants({ activityId: Number(id) }),
    {
      enabled: !!id,
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
        // setInvitedBuddies([...invitedBuddies, variables?.id])
        queryClient.invalidateQueries(["activity", id]);
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
  }, [queryStringDebounced, data?.data]);

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

  const anySearchResults = [...(activityMembers ?? [])]?.length > 0;

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
            backgroundColor: "rgba(74, 20, 140, 0.18)",
            borderRadius: "10px",
          }}
          data-testid="activities-search-input"
        />
        {(data?.data?.activity?.count_confirmed ?? 0) < 1 ? (
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
                  actionContent={
                    <BuddyActionContent
                      userId={member?.id}
                      onActionClick={handleActionClick}
                    />
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
