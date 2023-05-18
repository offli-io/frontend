import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import PlaceIcon from "@mui/icons-material/Place";

import { Controller, UseFormReturn } from "react-hook-form";
import OffliButton from "../../../components/offli-button";
import activityLocation from "../../../assets/img/activity-location.svg";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLocationFromQuery,
  getLocationFromQueryFetch,
  getPlaceFromCoordinates,
} from "../../../api/activities/requests";
import { useDebounce } from "use-debounce";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  IPlaceExternalApiDto,
  IPlaceExternalApiResultDto,
} from "../../../types/activities/place-external-api.dto";
import { ILocation } from "../../../types/activities/location.dto";
import NearMeIcon from "@mui/icons-material/NearMe";
import { useCurrentLocation } from "../../../hooks/use-current-location";
import { useGeolocated } from "react-geolocated";
import { useNavigate } from "react-router-dom";
import { ApplicationLocations } from "../../../types/common/applications-locations.dto";

interface IPlaceFormProps {
  onLocationSelect: (location: ILocation) => void;
  externalLocation?: ILocation | null;
}

export const SetLocationContent: React.FC<IPlaceFormProps> = ({
  onLocationSelect,
  externalLocation,
}) => {
  const [placeQuery, setPlaceQuery] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState<
    IPlaceExternalApiResultDto | undefined | null
  >(null);

  const [latLonBrowserTuple, setLatLonBrowserTuple] = React.useState<
    { lat?: number; lon?: number } | undefined
  >();

  const queryClient = useQueryClient();

  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      //   userDecisionTimeout: 5000,
      //   suppressLocationOnMount: true,
    });

  React.useEffect(() => {
    if (!!selectedLocation) {
      onLocationSelect({
        name: selectedLocation?.name,
        coordinates: {
          lat: selectedLocation?.lat,
          lon: selectedLocation?.lon,
        },
      });
    }
  }, [selectedLocation]);

  // filter backend results based on query string
  const [queryString] = useDebounce(placeQuery, 1000);

  const { data, isLoading } = useQuery(
    ["locations", queryString],
    (props) => getLocationFromQueryFetch(queryString),
    {
      enabled: !!queryString,
    }
  );

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

  React.useEffect(() => {
    if (!!placeFromCoordinatesData?.results) {
      onLocationSelect({
        name: placeFromCoordinatesData?.results?.[0]?.name,
        coordinates: {
          lat: placeFromCoordinatesData?.results?.[0]?.lat,
          lon: placeFromCoordinatesData?.results?.[0]?.lon,
        },
      });
    }
  }, [placeFromCoordinatesData?.results]);

  const handleUseCurrentLocation = React.useCallback(() => {
    // queryClient.setQueryData(["current-location"], { coords });
    setLatLonBrowserTuple({ lat: coords?.latitude, lon: coords?.longitude });
    // onLocationSelect({ name: null, coordinates: });
  }, [coords]);

  return (
    <>
      <Box sx={{ display: "flex", width: "100%", alignItems: "flex-end" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // pl: 2,
            width: "50%",
          }}
        >
          <Typography variant="h2" sx={{ color: "primary.main" }}>
            Set
          </Typography>
          <Typography variant="h2">location</Typography>
        </Box>
        <Box sx={{ width: "50%", display: "flex", justifyContent: "center" }}>
          <img src={activityLocation} style={{ height: 80 }} alt="place-form" />
        </Box>
      </Box>
      <OffliButton
        variant="text"
        sx={{
          fontSize: 16,
          mt: 2,
        }}
        startIcon={<PlaceIcon />}
      >
        {externalLocation?.name ?? "No location found"}
      </OffliButton>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "flex-start",
          mt: 2,
          px: 2,
          boxSizing: "border-box",
          //   mb: 30,
        }}
      >
        <Autocomplete
          value={selectedLocation}
          options={data?.results ?? []}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          loading={isLoading}
          onChange={
            (e, locationObject) =>
              onLocationSelect({
                name: locationObject?.name ?? locationObject?.city,
                coordinates: {
                  lat: locationObject?.lat,
                  lon: locationObject?.lon,
                },
              })

            // locationObject && setSelectedLocation(locationObject)
          }
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
          sx={{ width: "100%", my: 4 }}
          onClick={handleUseCurrentLocation}
          disabled={!coords}
        >
          Use my current location
        </OffliButton>
      </Box>
    </>
  );
};
