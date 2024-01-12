import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Autocomplete, Box, IconButton, TextField, Typography, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { SetStateAction } from 'react';
import { Controller, ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import SetOnMapScreen from 'screens/set-on-map-screen/set-on-map-screen';
import { ILocation } from 'types/activities/location.dto';
import { useDebounce } from 'use-debounce';
import { getLocationFromQueryFetch } from '../../../api/activities/requests';
import activityLocation from '../../../assets/img/activity-location.svg';
import OffliButton from '../../../components/offli-button';
import { mapExternalApiOptions } from '../../../utils/map-location-value.util';
import { FormValues } from '../utils/validation-schema';
import {
  getHistorySearchesFromStorage,
  pushSearchResultIntoStorage
} from 'utils/search-history-utils';

interface IPlaceFormProps {
  onNextClicked: () => void;
  onBackClicked: () => void;
  methods: UseFormReturn<FormValues>;
  isMap?: boolean;
  toggleMap?: React.Dispatch<SetStateAction<boolean>>;
}

export const PlaceForm: React.FC<IPlaceFormProps> = ({
  onNextClicked,
  onBackClicked,
  methods,
  isMap,
  toggleMap
}) => {
  const { control, setValue, watch } = methods;
  const { palette } = useTheme();

  // filter backend results based on query string
  const [queryString] = useDebounce(watch('placeQuery'), 1000);

  const placeQuery = useQuery(
    ['locations', queryString],
    () => getLocationFromQueryFetch(String(queryString)),
    {
      enabled: !!queryString
    }
  );

  const selectedLocation = watch('location')?.name;

  const handleLocationSaveViaMap = React.useCallback(
    (location?: ILocation | null) => {
      setValue('location', location);
      toggleMap?.(false);
    },
    [setValue]
  );

  const handleLocationSelect = React.useCallback(
    (field: ControllerRenderProps<FormValues, 'location'>) =>
      (e: React.SyntheticEvent<Element, Event>, location: ILocation | null) => {
        field.onChange({
          name: location?.name ?? '',
          coordinates: location?.coordinates
        });
        if (location && placeQuery?.data?.results) {
          pushSearchResultIntoStorage(location);
        }
      },
    [setValue, placeQuery?.data?.results]
  );

  return (
    <>
      {isMap ? (
        <SetOnMapScreen onLocationSave={handleLocationSaveViaMap} />
      ) : (
        <>
          <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-end' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                justifyContent: 'center',
                // pl: 2,
                width: '50%',
                ml: 1
              }}>
              <Typography variant="h1" sx={{ color: 'primary.main' }}>
                Set
              </Typography>
              <Typography variant="h1" sx={{ color: palette.text.primary }}>
                location
              </Typography>
            </Box>
            <Box sx={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
              <img src={activityLocation} style={{ height: 120 }} alt="place-form" />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              alignItems: 'flex-start',
              mt: 4
            }}>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    mb: 3
                  }}>
                  <Autocomplete
                    {...field}
                    options={
                      placeQuery?.data?.results
                        ? mapExternalApiOptions(placeQuery?.data?.results)
                        : getHistorySearchesFromStorage()
                    }
                    value={field?.value}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                    loading={placeQuery?.isLoading}
                    onChange={handleLocationSelect(field)}
                    getOptionLabel={(option) => String(option?.name)}
                    inputValue={field?.value?.name}
                    // inputValue={inputValue ?? ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search place"
                        onChange={(e) => setValue('placeQuery', e.target.value)}
                      />
                    )}
                    data-testid="activity-place-input"
                  />
                  <IconButton onClick={() => toggleMap?.(true)}>
                    <AddLocationAltIcon
                      sx={{
                        color: ({ palette }) => palette?.primary?.main,
                        ml: 1,
                        bgcolor: ({ palette }) => palette?.primary?.light,
                        borderRadius: '10px',
                        p: 1.75
                      }}
                    />
                  </IconButton>
                </Box>
              )}
            />
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
            <IconButton
              onClick={onBackClicked}
              color="primary"
              data-testid="back-btn"
              sx={{ fontSize: 20 }}>
              <ArrowBackIosNewIcon sx={{ color: 'inherit', mr: 1 }} />
              Back
            </IconButton>
            <OffliButton
              onClick={onNextClicked}
              sx={{ width: '40%', height: 50 }}
              disabled={!selectedLocation}
              data-testid="next-btn">
              Next
            </OffliButton>
          </Box>
        </>
      )}
    </>
  );
};
