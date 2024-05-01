import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { LocationContext } from 'context/providers/location-provider';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { HeaderContext } from '../../context/providers/header-provider';
import { DrawerContext } from '../../context/providers/drawer-provider';
import ActivitySearchCard from '../../components/activity-search-card';
import { useActivities } from '../../hooks/use-activities';
import { IActivityListRestDto } from '../../types/activities/activity-list-rest.dto';
import { ApplicationLocations } from '../../types/common/applications-locations.dto';
import FiltersDrawerContent from './components/filters-drawer-content';
import { IFiltersDto } from './types/filters.dto';
import { generateSortValue } from './utils/generate-sort-value.util';
import { SearchTabDefinitionsEnum } from './types/search-tab-definitions-enum.dto';
import { LayoutContext } from 'app/layout';
import { useUsers } from 'hooks/use-users';
import BuddyItem from 'components/buddy-item';
import ClearIcon from '@mui/icons-material/Clear';

const SearchScreen = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // const history = useHistory()
  const location = useLocation();
  const [currentSearch, setCurrentSearch] = React.useState('');
  const [queryStringDebounced] = useDebounce(currentSearch, 250);
  const [currentTab, setCurrentTab] = React.useState<SearchTabDefinitionsEnum>(
    SearchTabDefinitionsEnum.ACTIVITIES
  );
  const [filters, setFilters] = React.useState<IFiltersDto | undefined>();
  const { toggleDrawer } = React.useContext(DrawerContext);
  const { location: userLocation } = React.useContext(LocationContext);
  const { setSwipeHandlers } = React.useContext(LayoutContext);

  const { setHeaderRightContent, headerRightContent } = React.useContext(HeaderContext);
  const isTag = queryStringDebounced?.includes('tag');
  const todayFallbackDate = React.useMemo(() => new Date(), []);

  React.useEffect(() => {
    setSwipeHandlers?.({
      left: () => {
        setCurrentTab(SearchTabDefinitionsEnum.USERS);
      },
      right: () => {
        setCurrentTab(SearchTabDefinitionsEnum.ACTIVITIES);
      }
    });
  }, [currentTab]);

  const { data: { data: { activities = [] } = {} } = {}, isLoading: areActivitiesLoading } =
    useActivities<IActivityListRestDto>({
      params: {
        text: isTag ? undefined : queryStringDebounced,
        tag: filters?.tags,
        datetimeFrom: filters?.date ?? todayFallbackDate,
        lat: userLocation?.coordinates?.lat,
        lon: userLocation?.coordinates?.lon,
        sort: filters?.filter ? (generateSortValue(filters?.filter) as any) : undefined
      },
      enabled: currentTab === SearchTabDefinitionsEnum.ACTIVITIES
    });

  const { users, isLoading: areUsersLoading } = useUsers({
    params: {
      username: queryStringDebounced
    },
    queryOptions: {
      enabled: currentTab === SearchTabDefinitionsEnum.USERS && !!queryStringDebounced
    }
  });

  const handleApplyFilters = React.useCallback(
    //why isn't this type infered from component signature props interface?
    (newFilters: IFiltersDto) => {
      const currentParams = new URLSearchParams();
      if (newFilters?.filter) {
        currentParams.set('filter', newFilters?.filter);
      }
      if (newFilters?.date) {
        const epochTime = newFilters?.date?.getTime();
        currentParams.set('date', String(epochTime));
      }
      if (newFilters?.tags && newFilters?.tags?.length > 0) {
        newFilters.tags.forEach((tag) => currentParams.append('tags', tag));
      }
      setSearchParams(currentParams, {
        state: location?.state
      });
      toggleDrawer({ open: false, content: undefined });
    },
    [location]
  );

  React.useEffect(() => {
    const filter = searchParams?.get('filter');
    const epochDate = searchParams?.get('date');
    const date = epochDate ? new Date(Number(epochDate)) : null;
    const tags = searchParams?.getAll('tags');
    if (filter || date || (!!tags && tags?.length > 0))
      setFilters({
        filter: filter,
        date: date ?? undefined,
        tags
      });
  }, [searchParams]);

  //TODO custom date year not working

  const toggleFilters = React.useCallback(() => {
    toggleDrawer({
      open: true,
      content: <FiltersDrawerContent onApplyFilters={handleApplyFilters} filters={filters} />
    });
  }, [filters, handleApplyFilters]);

  React.useEffect(() => {
    //TODO fix this not to run on every re-render but I dont know how to solve this for now
    if (!headerRightContent && currentTab === SearchTabDefinitionsEnum.ACTIVITIES) {
      setHeaderRightContent(
        <IconButton
          onClick={toggleFilters}
          color={filters ? 'primary' : undefined}
          data-testid="toggle-filters-btn">
          <FilterListIcon sx={{ color: 'primary.main' }} />
        </IconButton>
      );
    }
  });

  React.useEffect(() => {
    currentTab === SearchTabDefinitionsEnum.USERS && setHeaderRightContent(undefined);
  }, [currentTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: SearchTabDefinitionsEnum) => {
    setCurrentTab(newValue);
  };

  const [isFocused, setIsFocused] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);

  const handleClearButtonClick = () => {
    setCurrentSearch('');
    setShowClearButton(true);
    setIsFocused(false);
  };

  useEffect(() => {
    setShowClearButton(!!currentSearch);
  }, [currentSearch]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          position: 'sticky',
          backgroundColor: ({ palette }) => palette?.background?.default
        }}>
        <TextField
          sx={{
            width: '95%',
            display: 'flex',
            justifyContent: 'center',
            my: 1,
            '& .MuiOutlinedInput-root': {
              pr: 0
            },
            '& input::placeholder': {
              fontSize: 14,
              color: 'primary.main',
              fontWeight: 500,
              opacity: 1,
              pl: 1
            },
            '& fieldset': { border: 'none' },
            backgroundColor: ({ palette }) => palette?.primary?.light,
            borderRadius: '10px'
          }}
          value={currentSearch}
          placeholder={
            isFocused
              ? ''
              : currentTab === SearchTabDefinitionsEnum.ACTIVITIES
                ? 'Search by text in activity'
                : 'Search by username'
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 24, color: 'primary.main' }} />
              </InputAdornment>
            ),
            endAdornment: showClearButton && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearButtonClick}>
                  <ClearIcon sx={{ fontSize: 24 }} />
                </IconButton>
              </InputAdornment>
            )
          }}
          onChange={(e) => setCurrentSearch(e.target.value)}
          data-testid="search-activities-input"
        />
      </Box>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          '& .MuiTab-root': {
            textTransform: 'capitalize',
            fontSize: 16
          },
          px: 1,
          mb: 1
        }}
        // allowScrollButtonsMobile
        // scrollButtons="auto"
      >
        <Tab
          label={SearchTabDefinitionsEnum.ACTIVITIES}
          value={SearchTabDefinitionsEnum.ACTIVITIES}></Tab>
        <Tab label={SearchTabDefinitionsEnum.USERS} value={SearchTabDefinitionsEnum.USERS}></Tab>
      </Tabs>
      {currentTab === SearchTabDefinitionsEnum.ACTIVITIES ? (
        <Box sx={{ ml: 1.5, boxSizing: 'border-box' }}>
          {areActivitiesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : activities?.length > 0 ? (
            activities?.map((activity) => (
              <React.Fragment key={activity?.id}>
                <ActivitySearchCard
                  activity={activity}
                  onPress={({ id } = {}) =>
                    navigate(`${ApplicationLocations.ACTIVITY_DETAIL}/${id}`, {
                      state: {
                        from: ApplicationLocations.SEARCH
                      }
                    })
                  }
                />
              </React.Fragment>
            ))
          ) : (
            <Typography sx={{ textAlign: 'center', mt: 4 }} variant="subtitle2">
              {queryStringDebounced ? 'No activities found' : 'Type activity name to see results'}
            </Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ ml: 1.5, boxSizing: 'border-box' }}>
          {areUsersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress color="primary" />
            </Box>
          ) : users?.length > 0 ? (
            users?.map((user) => (
              <BuddyItem
                key={user?.id}
                buddy={user}
                onClick={() => navigate(`${ApplicationLocations.USER_PROFILE}/${user?.id}`)}
              />
            ))
          ) : (
            <Typography sx={{ textAlign: 'center', mt: 4 }} variant="subtitle2">
              {queryStringDebounced ? 'No users found' : 'Type username to see results'}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchScreen;
