import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Autocomplete,
  Box,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { SetStateAction } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import SetOnMapScreen from "screens/set-on-map-screen/set-on-map-screen";
import { ILocation } from "types/activities/location.dto";
import { useDebounce } from "use-debounce";
import { getLocationFromQueryFetch } from "../../../api/activities/requests";
import activityLocation from "../../../assets/img/activity-location.svg";
import OffliButton from "../../../components/offli-button";
import { mapLocationValue } from "../../../utils/map-location-value.util";
import { FormValues } from "../create-activity-screen";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";

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
  toggleMap,
}) => {
  const { control, setValue, formState, watch } = methods;
  const { palette } = useTheme();

  // filter backend results based on query string
  const [queryString] = useDebounce(watch("placeQuery"), 1000);

  const placeQuery = useQuery(
    ["locations", queryString],
    (props) => getLocationFromQueryFetch(String(queryString)),
    {
      enabled: !!queryString,
    }
  );

  const selectedLocation = watch("location")?.name;

  const handleLocationSaveViaMap = React.useCallback(
    (location?: ILocation | null) => {
      setValue("location", location);
      toggleMap?.(false);
    },
    [setValue]
  );

  return (
    <>
      {isMap ? (
        <SetOnMapScreen onLocationSave={handleLocationSaveViaMap} />
      ) : (
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
              <Typography variant="h2" sx={{ color: palette.text.primary }}>
                location
              </Typography>
            </Box>
            <Box
              sx={{ width: "50%", display: "flex", justifyContent: "center" }}
            >
              <img
                src={activityLocation}
                style={{ height: 80 }}
                alt="place-form"
              />
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
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
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
                  <IconButton onClick={() => toggleMap?.(true)}>
                    <LocationSearchingIcon
                      sx={{
                        color: ({ palette }) => palette?.primary?.main,
                        ml: 1,
                      }}
                    />
                  </IconButton>
                </Box>
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
              <ArrowBackIosNewIcon sx={{ color: "inherit" }} />
            </IconButton>
            <OffliButton
              onClick={onNextClicked}
              sx={{ width: "40%" }}
              disabled={!selectedLocation}
              data-testid="next-btn"
            >
              Next
            </OffliButton>
          </Box>
        </>
      )}
    </>
  );
};
