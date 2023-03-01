import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import { CLIENT_ID, SCOPE } from "../utils/common-constants";
import { addEventToCalendar } from "../api/google/requests";
import SearchIcon from "@mui/icons-material/Search";
import BackHeader from "../components/back-header";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import OffliButton from "../components/offli-button";
import { useTags } from "../hooks/use-tags";
import { useNavigate } from "react-router-dom";
import { useActivities } from "../hooks/use-activities";
import { IActivityListRestDto } from "../types/activities/activity-list-rest.dto";
import { useDebounce } from "use-debounce";
import ActivityCard from "../components/activity-card";

const event = {
  summary: "Test event Offli",
  location: "",
  start: {
    dateTime: "2022-12-18T09:00:00-07:00",
    timeZone: "America/Los_Angeles",
  },
  end: {
    dateTime: "2022-12-18T17:00:00-07:00",
    timeZone: "America/Los_Angeles",
  },
  // recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
  attendees: [],
  reminders: {
    useDefault: false,
    overrides: [
      { method: "email", minutes: 24 * 60 },
      { method: "popup", minutes: 10 },
    ],
  },
};

const SearchScreen = () => {
  // const { googleTokenClient } = React.useContext(AuthenticationContext)
  const { data, isLoading } = useTags();
  const navigate = useNavigate();
  const [currentSearch, setCurrentSearch] = React.useState("");
  const [queryStringDebounced] = useDebounce(currentSearch, 250);

  const isTag = queryStringDebounced?.includes("tag");

  const { data: activitiesData, isLoading: areActivitiesLoading } =
    useActivities<IActivityListRestDto>({
      text: isTag ? undefined : queryStringDebounced,
      tag: isTag ? [queryStringDebounced.slice(4)] : undefined,
    });

  const handleChipClick = React.useCallback(
    (label?: string) => {
      setCurrentSearch(label ? `tag:${label}` : "");
    },
    [setCurrentSearch]
  );
  return (
    <Box sx={{ px: 1.5, boxSizing: "border-box" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextField
          autoFocus
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            my: 1.5,
            "& .MuiOutlinedInput-root": {
              pr: 0,
            },
            "& input::placeholder": {
              fontSize: 14,
            },
          }}
          value={currentSearch}
          placeholder="Search by text in activity"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: "1.2rem" }} />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setCurrentSearch(e.target.value)}
        />

        <OffliButton
          variant="text"
          size="small"
          sx={{ fontSize: 14, ml: 1 }}
          onClick={() => navigate(ApplicationLocations.ACTIVITIES)}
        >
          Cancel
        </OffliButton>
      </Box>
      {isLoading ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        </>
      ) : (
        data?.data?.tags &&
        data?.data?.tags?.length > 0 && (
          <>
            <Typography variant="h5">What's your mood for?</Typography>
            {data.data.tags.map((tag) => (
              <Chip
                label={tag?.title}
                key={tag?.title}
                sx={{ mx: 1, my: 0.5 }}
                color="primary"
                onClick={() => handleChipClick(tag?.title)}
              />
            ))}
          </>
        )
      )}
      <Divider sx={{ my: 2 }} />
      {areActivitiesLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        activitiesData?.data?.activities?.map((activity) => (
          <ActivityCard
            key={activity?.id}
            activity={activity}
            onPress={(act) => console.log(act)}
          />
        ))
      )}

      <Button onClick={() => addEventToCalendar("thefaston@gmail.com", event)}>
        Create calendar Event
      </Button>
    </Box>
  );
};

export default SearchScreen;
