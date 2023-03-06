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
import { getLocationFromQuery } from "../../../api/activities/requests";
import { useDebounce } from "use-debounce";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IPlaceExternalApiDto } from "../../../types/activities/place-external-api.dto";
import { ILocation } from "../../../types/activities/location.dto";
import NearMeIcon from "@mui/icons-material/NearMe";

interface IPlaceFormProps {
  onLocationSelect: (location: ILocation) => void;
}

export const SetLocationContent: React.FC<IPlaceFormProps> = ({
  onLocationSelect,
}) => {
  const [placeQuery, setPlaceQuery] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState<
    IPlaceExternalApiDto | undefined | null
  >();

  // filter backend results based on query string
  const [queryString] = useDebounce(placeQuery, 1000);

  const { data, isLoading } = useQuery(
    ["locations", queryString],
    (props) => getLocationFromQuery(queryString),
    {
      enabled: !!queryString,
    }
  );

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
          px: 2,
          boxSizing: "border-box",
          //   mb: 30,
        }}
      >
        <Autocomplete
          value={selectedLocation}
          options={data?.data ?? []}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          loading={isLoading}
          onChange={(e, locationObject: IPlaceExternalApiDto | null) =>
            // setSelectedLocation({
            //   name: locationObject?.display_name,
            //   coordinates: {
            //     lat: Number(locationObject?.lat),
            //     lon: Number(locationObject?.lon),
            //   },
            // })
            setSelectedLocation(locationObject)
          }
          getOptionLabel={(option) => option?.display_name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search place"
              onChange={(e) => setPlaceQuery(e.target.value)}
            />
          )}
        />
        <OffliButton startIcon={<NearMeIcon />} sx={{ width: "100%", my: 4 }}>
          Use my current location
        </OffliButton>
      </Box>
    </>
  );
};
