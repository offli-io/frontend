import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { DrawerContext } from "../../assets/theme/drawer-provider";
import ActivitySearchCard from "../../components/activity-search-card";
import BackHeader from "../../components/back-header";
import OffliButton from "../../components/offli-button";
import { useActivities } from "../../hooks/use-activities";
import { IActivityListRestDto } from "../../types/activities/activity-list-rest.dto";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import FiltersDrawerContent from "./components/filters-drawer-content";
import { IFiltersDto } from "./types/filters.dto";

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
  const navigate = useNavigate();
  const [currentSearch, setCurrentSearch] = React.useState("");
  const [queryStringDebounced] = useDebounce(currentSearch, 250);
  const [filters, setFilters] = React.useState<IFiltersDto | undefined>();
  const { toggleDrawer } = React.useContext(DrawerContext);

  const isTag = queryStringDebounced?.includes("tag");

  const { data: activitiesData, isLoading: areActivitiesLoading } =
    useActivities<IActivityListRestDto>({
      text: isTag ? undefined : queryStringDebounced,
      tag: isTag ? [queryStringDebounced.slice(4)] : undefined,
    });

  const handleApplyFilters = React.useCallback(
    //why isn't this type infered from component signature props interface?
    (newFilters: IFiltersDto) => {
      setFilters(newFilters);
      toggleDrawer({ open: false, content: undefined });
    },
    []
  );

  const toggleFilters = React.useCallback(() => {
    toggleDrawer({
      open: true,
      content: (
        <FiltersDrawerContent
          onApplyFilters={handleApplyFilters}
          filters={filters}
        />
      ),
    });
  }, [filters, handleApplyFilters]);

  return (
    <>
      <BackHeader
        title="Search activities"
        sx={{ mb: 2 }}
        to={ApplicationLocations.ACTIVITIES}
        headerRightContent={
          <IconButton
            onClick={toggleFilters}
            color={!!filters ? "primary" : undefined}
          >
            <FilterListIcon />
          </IconButton>
        }
      />
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
        {/* {isLoading ? (
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
              <Box
                sx={{
                  display: "flex",
                  overflowX: "scroll",
                  width: "100%",
                  "::-webkit-scrollbar": { display: "none" },
                }}
              >
                {data.data.tags.map((tag) => (
                  <Chip
                    label={tag?.title}
                    key={tag?.title}
                    sx={{ m: 1 }}
                    color="primary"
                    onClick={() => handleChipClick(tag?.title)}
                  />
                ))}
              </Box>
            </>
          )
        )} */}
        <Divider sx={{ my: 2 }} />
        {areActivitiesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          activitiesData?.data?.activities?.map((activity) => (
            <ActivitySearchCard
              key={activity?.id}
              activity={activity}
              onPress={(act) => console.log(act)}
            />
          ))
        )}
        {/* 
      <Button onClick={() => addEventToCalendar("thefaston@gmail.com", event)}>
        Create calendar Event
      </Button> */}
      </Box>
    </>
  );
};

export default SearchScreen;
