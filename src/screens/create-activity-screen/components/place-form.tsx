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
import { Controller, UseFormReturn } from "react-hook-form";
import OffliButton from "../../../components/offli-button";
import activityLocation from "../../../assets/img/activity-location.svg";
import { useQuery } from "@tanstack/react-query";
import {
  getLocationFromQuery,
  getLocationFromQueryFetch,
} from "../../../api/activities/requests";
import { useDebounce } from "use-debounce";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { mapPlaceValue } from "../utils/map-place-value.util";
import { FormValues } from "../create-activity-screen";
import { mapLocationValue } from "../../../utils/map-location-value.util";

interface IPlaceFormProps {
  onNextClicked: () => void;
  onBackClicked: () => void;
  methods: UseFormReturn<FormValues>;
}

const top100Films = [
  {
    type: "idk",
    id: 225,
    lat: 22.5,
    lon: 32.8,
    tags: {
      city_limit: "ahoj",
      name: "Bratislava",
      traffic_sign: "auta",
    },
  },
  {
    type: "neviem",
    id: 226,
    lat: 22.9,
    lon: 12.05,
    tags: {
      city_limit: "cauko",
      name: "Praha",
      traffic_sign: "tramvaj",
    },
  },
];

export const PlaceForm: React.FC<IPlaceFormProps> = ({
  onNextClicked,
  onBackClicked,
  methods,
}) => {
  const { control, setValue, formState, watch } = methods;

  // filter backend results based on query string
  const [queryString] = useDebounce(watch("placeQuery"), 1000);

  const placeQuery = useQuery(
    ["locations", queryString],
    (props) => getLocationFromQueryFetch(String(queryString)),
    {
      enabled: !!queryString,
    }
  );

  const inputValue = watch("placeQuery");

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "flex-start",
          mt: 4,
        }}
      >
        <Controller
          name="location"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              options={placeQuery?.data?.results ?? []}
              value={mapLocationValue(field?.value)}
              isOptionEqualToValue={(option, value) =>
                option?.formatted === (value?.formatted ?? value?.name)
              }
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
              loading={placeQuery?.isLoading}
              onChange={(e, locationObject) =>
                field.onChange({
                  name: locationObject?.formatted,
                  coordinates: {
                    lat: locationObject?.lat,
                    lon: locationObject?.lon,
                  },
                })
              }
              getOptionLabel={(option) => String(option?.formatted)}
              // inputValue={inputValue ?? ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search place"
                  onChange={(e) => setValue("placeQuery", e.target.value)}
                />
              )}
              data-testid="activity-place-input"
            />
          )}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          onClick={onBackClicked}
          color="primary"
          data-testid="back-btn"
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <OffliButton
          onClick={onNextClicked}
          sx={{ width: "40%" }}
          disabled={!formState.isValid}
          data-testid="next-btn"
        >
          Next
        </OffliButton>
      </Box>
    </>
  );
};
