import * as React from "react";
import { Autocomplete, InputAdornment, SxProps, TextField } from "@mui/material";
import { ApplicationLocations } from "types/common/applications-locations.dto";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

interface SearchbarProps {
    Input: string;
    sx?: SxProps;
  }

const Searchbar : React.FC<SearchbarProps> = ({ Input, sx })  => {
    const navigate = useNavigate();
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);
    return (
        <Autocomplete
        options={[]}
        forcePopupIcon={false}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mb: 1,
          "& .MuiOutlinedInput-root": {
            pr: 0,
          },
          ...sx,
        }}
        //loading={placeQuery?.isLoading}
        // isOptionEqualToValue={(option, value) => option.id === value.id}
        onFocus={() =>
          navigate(ApplicationLocations.SEARCH, {
            state: {
              from: ApplicationLocations.ACTIVITIES,
            },
          })
        }
        onBlur={() => setIsSearchFocused(false)}
        // getOptionLabel={(option) => option?.display_name}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={Input}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: "1.5rem", color: "#4A148C" }} />{" "}
                </InputAdornment>
              ),
            }}
            sx={{
              "& input::placeholder": {
                fontSize: 14,
                color: "#4A148C",
                fontWeight: 400,
                opacity: 1,
                pl: 1,
              },
              "& fieldset": { border: "none" },
              backgroundColor: ({ palette }) => palette?.primary?.light,
              borderRadius: "10px",
            }}
            data-testid="activities-search-input"
            // onChange={(e) => setValue("placeQuery", e.target.value)}
          />
        )}
      />
    )
}
export default Searchbar;