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
import {
  URLSearchParamsInit,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
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

const SearchScreen = () => {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  // const history = useHistory()
  const location = useLocation();
  const [currentSearch, setCurrentSearch] = React.useState("");
  const [queryStringDebounced] = useDebounce(currentSearch, 250);
  const [filters, setFilters] = React.useState<IFiltersDto | undefined>();
  const { toggleDrawer } = React.useContext(DrawerContext);
  const { setHeaderRightContent } = React.useContext(HeaderContext);
  const isFirstVisitRender = React.useRef(true);
  let params = new URLSearchParams(document.location.search);
  console.log(params);

  const isTag = queryStringDebounced?.includes("tag");

  const { data: activitiesData, isLoading: areActivitiesLoading } =
    useActivities<IActivityListRestDto>({
      text: isTag ? undefined : queryStringDebounced,
      tag: filters?.tags,
      datetimeFrom: filters?.date,
    });

  const handleApplyFilters = React.useCallback(
    //why isn't this type infered from component signature props interface?
    (newFilters: IFiltersDto) => {
      console.log(newFilters);
      const currentParams = new URLSearchParams();
      if (newFilters?.filter) {
        currentParams.set("filter", newFilters?.filter);
      }
      if (newFilters?.date) {
        const epochTime = newFilters?.date?.getTime();
        currentParams.set("date", String(epochTime));
      }
      if (newFilters?.tags && newFilters?.tags?.length > 0) {
        newFilters.tags.forEach((tag) => currentParams.append("tags", tag));
      }
      setSearchParams(currentParams);
      toggleDrawer({ open: false, content: undefined });
    },
    []
  );

  React.useEffect(() => {
    const filter = searchParams?.get("filter");
    const epochDate = searchParams?.get("date");
    const date = epochDate ? new Date(Number(epochDate)) : null;
    const tags = searchParams?.getAll("tags");
    if (filter || date || (!!tags && tags?.length > 0))
      setFilters({
        filter: filter,
        date: date ?? undefined,
        tags,
      });
  }, [searchParams]);

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
    // if(isFirstVisitRender) {}
    setHeaderRightContent(
      <IconButton
        onClick={toggleFilters}
        color={!!filters ? "primary" : undefined}
        data-testid="toggle-filters-btn"
      >
        <FilterListIcon />
      </IconButton>
    );
  }, [toggleFilters, filters, setHeaderRightContent, searchParams]);

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
