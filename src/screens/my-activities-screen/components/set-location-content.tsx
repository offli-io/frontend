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
import Searchbar from "components/searchbar";

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
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          mt: 1.5,
          gap: 7
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Typography variant="h2" sx={{ color: "primary.main" }}>
            Set
          </Typography>
          <Typography variant="h2">location</Typography>
        </Box>
        <Box sx={{display: "flex", justifyContent: "center" }}>
          <img src={activityLocation} style={{ height: 90 }} alt="place-form" />
        </Box>
      </Box>
      <OffliButton
        variant="text"
        sx={{
          fontSize: 16,
          alignContent: "center",
          mt: 2,
        }}
          startIcon={<PlaceIcon sx={{color: "primary.main",}}/>}
      >
        {externalLocation?.name ?? "No location found"}
      </OffliButton>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
          mt: 2,
          px: 2,
          boxSizing: "border-box",
          //   mb: 30,
        }}
      >
        <Searchbar Input={"Find events anywhere"}></Searchbar>
        <OffliButton
          startIcon={<NearMeIcon sx={{color: "white"}}/>}
          sx={{ width: "90%", my: 4, fontSize: 16 }}
          onClick={handleUseCurrentLocation}
          disabled={!coords}
        >
          Use my current location
        </OffliButton>
      </Box>
    </Box>
  );
};
