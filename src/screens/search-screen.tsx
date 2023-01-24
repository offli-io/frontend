import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import { CLIENT_ID, SCOPE } from "../utils/common-constants";
import { addEventToCalendar } from "../api/google/requests";
import SearchIcon from "@mui/icons-material/Search";
import BackHeader from "../components/back-header";
import { ApplicationLocations } from "../types/common/applications-locations.dto";

const event = {
  summary: "Test event Offli",
  location: "",
  start: {
    dateTime: "2022-12-18T09:00:00-07:00",
    timeZone: "America/Los_Angeles",
  },
  end: {
    dateTime: "2022-12-18T17:00:00-07:00",
    timeZone: "America/Los_Angeles",
  },
  // recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
  attendees: [],
  reminders: {
    useDefault: false,
    overrides: [
      { method: "email", minutes: 24 * 60 },
      { method: "popup", minutes: 10 },
    ],
  },
};

const SearchScreen = () => {
  // const { googleTokenClient } = React.useContext(AuthenticationContext)
  return (
    <>
      <BackHeader
        title="Search activity"
        sx={{ mb: 1 }}
        to={ApplicationLocations.ACTIVITIES}
      />
      <Box
        sx={{
          // height: '100vh',
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 1.5,
          boxSizing: "border-box",
        }}
        // className="backgroundImage"
      >
        <Autocomplete
          options={[]}
          forcePopupIcon={false}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            my: 1.5,
            "& .MuiOutlinedInput-root": {
              pr: 0,
            },
          }}
          //loading={placeQuery?.isLoading}
          // isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(e, locationObject) => console.log(locationObject)}
          // onFocus={() => setIsSearchFocused(true)}
          // onBlur={() => setIsSearchFocused(false)}
          // getOptionLabel={(option) => option?.display_name}
          renderInput={(params) => (
            <TextField
              {...params}
              autoFocus
              placeholder="What kind of activity are you looking for?"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: "1.2rem" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& input::placeholder": {
                  fontSize: 14,
                },
              }}
              // onChange={(e) => setValue("placeQuery", e.target.value)}
            />
          )}
        />
      </Box>
      {/* <Button onClick={() => addEventToCalendar("thefaston@gmail.com", event)}>
        Create calendar Event
      </Button> */}
    </>
  );
};

export default SearchScreen;
