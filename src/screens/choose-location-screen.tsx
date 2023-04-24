import React from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Autocomplete,
} from "@mui/material";
import qs from "qs";
import Logo from "../components/logo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import OffliButton from "../components/offli-button";
import LabeledDivider from "../components/labeled-divider";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import NearMeIcon from "@mui/icons-material/NearMe";

import { useSnackbar } from "notistack";
import {
  getAuthToken,
  setAuthToken,
  setRefreshToken,
} from "../utils/token.util";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import { useNavigate } from "react-router-dom";
import { DEFAULT_KEYCLOAK_URL } from "../assets/config";
import { loginUser } from "../api/auth/requests";
import { useDebounce } from "use-debounce";
import {
  getLocationFromQuery,
  getLocationFromQueryFetch,
  getPlaceFromCoordinates,
} from "../api/activities/requests";
import chooseLocationUrl from "../assets/img/choose-location.svg";

import { IPlaceExternalApiResultDto } from "../types/activities/place-external-api.dto";
import { ILocation } from "../types/activities/location.dto";
import { updateProfileInfo } from "../api/users/requests";
import { useGeolocated } from "react-geolocated";

export interface FormValues {
  placeQuery: string;
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    placeQuery: yup.string().defined().required(),
  });

const ChooseLocationScreen: React.FC = () => {
  const [placeQuery, setPlaceQuery] = React.useState("");
  const { userInfo } = React.useContext(AuthenticationContext);
  const [selectedLocation, setSelectedLocation] = React.useState<
    IPlaceExternalApiResultDto | undefined | null
  >(null);

  const [latLonBrowserTuple, setLatLonBrowserTuple] = React.useState<
    { lat?: number; lon?: number } | undefined
  >();

  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      //   userDecisionTimeout: 5000,
      //   suppressLocationOnMount: true,
    });

  const {
    data: placeFromCoordinatesData,
    isLoading: isPlaceFromCoordinatesDataLoading,
  } = useQuery(
    ["locations", latLonBrowserTuple],
    () =>
      getPlaceFromCoordinates(
        Number(latLonBrowserTuple?.lat),
        Number(latLonBrowserTuple?.lon)
      ),
    {
      enabled: !!latLonBrowserTuple,
    }
  );

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [queryString] = useDebounce(placeQuery, 1000);

  const { data, isLoading } = useQuery(
    ["locations", queryString],
    (props) => getLocationFromQueryFetch(queryString),
    {
      enabled: !!queryString,
    }
  );

  const { mutate: sendUpdateProfile } = useMutation(
    ["update-profile-info"],
    (location: ILocation) => updateProfileInfo(userInfo?.id, { location }),
    {
      onSuccess: (data, variables) => {
        //TODO what to invalidate, and where to navigate after success
        queryClient.invalidateQueries(["users"]);
        enqueueSnackbar("Your location was successfully saved", {
          variant: "success",
        });
        navigate(ApplicationLocations.ACTIVITIES);
      },
      onError: () => {
        enqueueSnackbar("Failed to select location", {
          variant: "error",
        });
      },
    }
  );

  const navigate = useNavigate();

  //TODO remove validation it is not needed here
  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      placeQuery: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

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
        lon: selectedLocation?.lon,
      },
    });
  }, [selectedLocation, sendUpdateProfile]);

  const handleUseCurrentLocation = React.useCallback(() => {
    // queryClient.setQueryData(["current-location"], { coords });
    setLatLonBrowserTuple({ lat: coords?.latitude, lon: coords?.longitude });
    // onLocationSelect({ name: null, coordinates: });
  }, [coords]);

  React.useEffect(() => {
    if (!!placeFromCoordinatesData?.results) {
      sendUpdateProfile({
        name: placeFromCoordinatesData?.results?.[0]?.name,
        coordinates: {
          lat: placeFromCoordinatesData?.results?.[0]?.lat,
          lon: placeFromCoordinatesData?.results?.[0]?.lon,
        },
      });
    }
  }, [placeFromCoordinatesData?.results]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mx: 5,
      }}
    >
      <Box sx={{ width: "100%", mb: 4, mt: -3, display: "flex" }}>
        <Typography variant="h2" color="primary" sx={{ mr: 1 }}>
          Choose
        </Typography>
        <Typography variant="h2">your location</Typography>
      </Box>
      <img
        style={{
          height: 100,
        }}
        src={chooseLocationUrl}
        alt="Choose location"
      />
      <Autocomplete
        value={selectedLocation}
        options={data?.results ?? []}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mt: 5,
          mb: 4,
        }}
        loading={isLoading}
        onChange={handleLocationSelect}
        getOptionLabel={(option) => String(option?.formatted)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search place"
            onChange={(e) => setPlaceQuery(e.target.value)}
          />
        )}
      />

      <OffliButton
        startIcon={<NearMeIcon />}
        sx={{ width: "100%", my: 2, fontSize: 16 }}
        onClick={handleUseCurrentLocation}
        disabled={!coords}
        variant="text"
      >
        Use my current location
      </OffliButton>

      <OffliButton
        sx={{ width: "100%", mb: 5 }}
        type="submit"
        disabled={!selectedLocation}
        onClick={handleConfirmSelectedLocation}
      >
        Let's explore
      </OffliButton>
    </Box>
  );
};

export default ChooseLocationScreen;
