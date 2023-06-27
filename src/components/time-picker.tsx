import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import { SxProps } from "@mui/material";

interface ITimePickerProps {
  label: string;
  sx?: SxProps;
  options: string[];
  onChange: (value: string | null) => void;
  getOptionDisabled?: (option: string) => boolean;
  defaultValue?: string;
  value?: string;
}

const TimePicker: React.FC<ITimePickerProps> = ({
  label,
  sx,
  options,
  onChange,
  getOptionDisabled,
  defaultValue,
  value,
  ...rest
}) => {
  return (
    <Autocomplete
      defaultValue={defaultValue}
      disableClearable
      id="autocomplete-time-picker"
      options={options}
      sx={sx}
      getOptionDisabled={getOptionDisabled}
      onChange={(event: React.SyntheticEvent, value: string | null) =>
        onChange(value)
      }
      renderInput={(params) => <TextField {...params} label={label} />}
      value={value}
      data-testid="activity-time-picker"
      {...rest}
    />
  );
};

export default TimePicker;
