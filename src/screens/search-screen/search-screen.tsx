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
import { HeaderContext } from "../../app/providers/header-provider";

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
  const { setHeaderRightContent } = React.useContext(HeaderContext);

  const isTag = queryStringDebounced?.includes("tag");

  const { data: activitiesData, isLoading: areActivitiesLoading } =
    useActivities<IActivityListRestDto>({
      text: isTag ? undefined : queryStringDebounced,
      tag: filters?.tags,
      datetimeFrom: filters?.date?.dateValue,
    });

  const handleApplyFilters = React.useCallback(
    //why isn't this type infered from component signature props interface?
    (newFilters: IFiltersDto) => {
      setFilters(newFilters);
      toggleDrawer({ open: false, content: undefined });
    },
    []
  );

  //TODO custom date year not working

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

  React.useEffect(() => {
    setHeaderRightContent(
      <IconButton
        onClick={toggleFilters}
        color={!!filters ? "primary" : undefined}
        data-testid="toggle-filters-btn"
      >
        <FilterListIcon />
      </IconButton>
    );
  }, [toggleFilters, filters]);

  return (
    <>
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
            data-testid="search-activities-input"
          />

          <OffliButton
            variant="text"
            size="small"
            sx={{ fontSize: 14, ml: 0.5 }}
            onClick={() => navigate(ApplicationLocations.ACTIVITIES)}
            data-testid="cancel-search-btn"
          >
            Cancel
          </OffliButton>
        </Box>

        <Divider sx={{ my: 2 }} />
        {areActivitiesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          activitiesData?.data?.activities?.map((activity) => (
            <>
              <ActivitySearchCard
                key={activity?.id}
                activity={activity}
                onPress={({ id } = {}) =>
                  navigate(`${ApplicationLocations.ACTIVITY_DETAIL}/${id}`, {
                    state: {
                      from: ApplicationLocations.SEARCH,
                    },
                  })
                }
              />
              <Divider sx={{ mb: 1 }} />
            </>
          ))
        )}
      </Box>
    </>
  );
};

export default SearchScreen;
