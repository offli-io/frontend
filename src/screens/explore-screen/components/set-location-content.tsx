import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import React from "react";
import PlaceIcon from "@mui/icons-material/Place";
import OffliButton from "../../../components/offli-button";
import activityLocation from "../../../assets/img/activity-location.svg";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLocationFromQueryFetch,
  getPlaceFromCoordinates,
} from "../../../api/activities/requests";
import { useDebounce } from "use-debounce";
import { IPlaceExternalApiResultDto } from "../../../types/activities/place-external-api.dto";
import { ILocation } from "../../../types/activities/location.dto";
import NearMeIcon from "@mui/icons-material/NearMe";
import { useGeolocated } from "react-geolocated";

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

  const isCurrentLocationLoading =
    !coords && isGeolocationAvailable && isGeolocationEnabled;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "flex-end",
          justifyContent: "space-between",
          mt: 2,
          gap: -2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "40%",
            ml: 5,
          }}
        >
          <Typography variant="h2" sx={{ color: "primary.main" }}>
            Set
          </Typography>
          <Typography variant="h2">location</Typography>
        </Box>
        <Box sx={{ width: "60%", display: "flex", justifyContent: "center" }}>
          <img src={activityLocation} style={{ height: 90 }} alt="place-form" />
        </Box>
      </Box>
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
        <Autocomplete
          value={selectedLocation}
          options={data?.results ?? []}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          loading={isLoading}
          onChange={(e, locationObject) =>
            onLocationSelect({
              name: locationObject?.name ?? locationObject?.city,
              coordinates: {
                lat: locationObject?.lat,
                lon: locationObject?.lon,
              },
            })
          }
          getOptionLabel={(option) => String(option?.formatted)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={externalLocation?.name ?? "Search places"}
              onChange={(e) => setPlaceQuery(e.target.value)}
              sx={{
                "& input::placeholder": {
                  fontSize: 14,
                  color: "primary.main",
                  opacity: 1,
                  pl: 1,
                },
                "& fieldset": { border: "none" },
                backgroundColor: ({ palette }) => palette?.primary?.light,
                borderRadius: "10px",
              }}
            />
          )}
        />
        <OffliButton
          startIcon={
            !isCurrentLocationLoading ? (
              <NearMeIcon sx={{ color: "background.default" }} />
            ) : undefined
          }
          sx={{ width: "80%", my: 4, fontSize: 16, height: 48 }}
          onClick={handleUseCurrentLocation}
          disabled={!coords}
          isLoading={!coords && isGeolocationAvailable && isGeolocationEnabled}
        >
          Use my current location
        </OffliButton>
      </Box>
    </Box>
  );
};
