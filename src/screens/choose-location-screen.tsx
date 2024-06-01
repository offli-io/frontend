import NearMeIcon from '@mui/icons-material/NearMe';
import { Autocomplete, Box, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useGeolocated } from 'react-geolocated';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { getLocationFromQueryFetch, getPlaceFromCoordinates } from '../api/activities/requests';
import { updateProfileInfo } from '../api/users/requests';
import chooseLocationUrl from '../assets/img/choose-location.svg';
import { AuthenticationContext } from '../components/context/providers/authentication-provider';
import { LocationContext } from '../components/context/providers/location-provider';
import OffliButton from '../components/offli-button';
import OffliTextField from '../components/offli-text-field';
import { ILocation } from '../types/activities/location.dto';
import { IPlaceExternalApiResultDto } from '../types/activities/place-external-api.dto';
import { ApplicationLocations } from '../types/common/applications-locations.dto';

const ChooseLocationScreen: React.FC = () => {
  const [placeQuery, setPlaceQuery] = React.useState('');
  const { userInfo } = React.useContext(AuthenticationContext);
  const [selectedLocation, setSelectedLocation] = React.useState<
    IPlaceExternalApiResultDto | undefined | null
  >(null);
  const { setLocation } = React.useContext(LocationContext);

  const [latLonBrowserTuple, setLatLonBrowserTuple] = React.useState<
    { lat?: number; lon?: number } | undefined
  >();

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false
    }
  });

  const { data: placeFromCoordinatesData } = useQuery(
    ['locations', latLonBrowserTuple],
    () => getPlaceFromCoordinates(Number(latLonBrowserTuple?.lat), Number(latLonBrowserTuple?.lon)),
    {
      enabled: !!latLonBrowserTuple
    }
  );

  const queryClient = useQueryClient();
  const [queryString] = useDebounce(placeQuery, 1000);

  const { data, isLoading: isLocationQueryLoading } = useQuery(
    ['locations', queryString],
    () => getLocationFromQueryFetch(queryString),
    {
      enabled: !!queryString
    }
  );

  const { mutate: sendUpdateProfile, isLoading: isUpdatingProfile } = useMutation(
    ['update-profile-info'],
    (location: ILocation) => updateProfileInfo(userInfo?.id, { location }),
    {
      onSuccess: (data, location) => {
        //TODO what to invalidate, and where to navigate after success
        setLocation?.(location);
        queryClient.invalidateQueries(['user']);
        //TODO display snackbar for first login? Idk too many windows (Welcome screen and snackbar)

        navigate(ApplicationLocations.EXPLORE);
      },
      onError: () => {
        toast.error('Failed to select location');
      }
    }
  );

  const navigate = useNavigate();

  const handleLocationSelect = React.useCallback(
    (e: any, locationObject: IPlaceExternalApiResultDto | null) => {
      setSelectedLocation(locationObject);
    },
    []
  );

  const handleConfirmSelectedLocation = React.useCallback(() => {
    sendUpdateProfile({
      name: selectedLocation?.formatted,
      coordinates: {
        lat: selectedLocation?.lat,
        lon: selectedLocation?.lon
      }
    });
  }, [selectedLocation, sendUpdateProfile]);

  const handleUseCurrentLocation = React.useCallback(() => {
    // queryClient.setQueryData(["current-location"], { coords });
    setLatLonBrowserTuple({ lat: coords?.latitude, lon: coords?.longitude });
    // onLocationSelect({ name: null, coordinates: });
  }, [coords]);

  React.useEffect(() => {
    if (placeFromCoordinatesData?.results) {
      sendUpdateProfile({
        name: placeFromCoordinatesData?.results?.[0]?.formatted,
        coordinates: {
          lat: placeFromCoordinatesData?.results?.[0]?.lat,
          lon: placeFromCoordinatesData?.results?.[0]?.lon
        }
      });
    }
  }, [placeFromCoordinatesData?.results]);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 5
      }}>
      <Box sx={{ width: '100%', mb: 4, mt: -3, display: 'flex' }}>
        <Typography variant="h2" color="primary" sx={{ mr: 1 }}>
          Choose
        </Typography>
        <Typography variant="h2">your location</Typography>
      </Box>
      <img
        style={{
          height: 100
        }}
        src={chooseLocationUrl}
        alt="Choose location"
      />
      <Autocomplete
        value={selectedLocation}
        options={data?.results ?? []}
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          mt: 5,
          mb: 4
        }}
        loading={isLocationQueryLoading}
        onChange={handleLocationSelect}
        getOptionLabel={(option) => String(option?.formatted)}
        renderInput={(params) => (
          <OffliTextField
            {...params}
            label="Search place"
            onChange={(e) => setPlaceQuery(e.target.value)}
            autoCapitalize="sentences"
          />
        )}
      />

      <OffliButton
        startIcon={<NearMeIcon />}
        sx={{ width: '100%', my: 2, fontSize: 16 }}
        onClick={handleUseCurrentLocation}
        disabled={!coords}
        isLoading={isGeolocationAvailable && isGeolocationEnabled && !coords}
        variant="text">
        Use my current location
      </OffliButton>

      <OffliButton
        sx={{ width: '100%', mb: 5 }}
        type="submit"
        disabled={!selectedLocation}
        onClick={handleConfirmSelectedLocation}
        isLoading={isUpdatingProfile}>
        {`Let's explore`}
      </OffliButton>
    </Box>
  );
};

export default ChooseLocationScreen;
