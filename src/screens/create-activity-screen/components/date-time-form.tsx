import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { MobileCarousel } from "../../../components/mobile-carousel";
import OffliButton from "../../../components/offli-button";
import TimePicker from "../../../components/time-picker";
import { generateDateSlots } from "../utils/generate-date-slots.util";
import { generateOptionsOrder } from "../utils/generate-options-order.util";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface IDateTimeForm {
  onNextClicked: () => void;

  onBackClicked: () => void;
  methods: UseFormReturn;
}

interface ITimeValues {
  from?: string;
  until?: string;
}

export const DateTimeForm: React.FC<IDateTimeForm> = ({
  onNextClicked,
  onBackClicked,
  methods,
}) => {
  const { control, formState, watch, setValue } = methods;
  const { palette } = useTheme();
  const [date, setDate] = React.useState({
    fromOptions: generateDateSlots(),
    untilOptions: generateDateSlots(),
  });
  const [sameEndDate, setSameEndDate] = React.useState(true);

  const isFormValid = !!watch("datetime_from") && !!watch("datetime_until");

  React.useEffect(() => {
    const selectedDate = date?.fromOptions?.find((item) => item.selected);

    if (selectedDate) {
      setValue("datetime_from", selectedDate?.dateValue);
      if (sameEndDate) {
        setValue("datetime_until", selectedDate?.dateValue);
      }
    }
  }, [date?.fromOptions, sameEndDate]);

  React.useEffect(() => {
    const selectedDate = date?.untilOptions?.find((item) => item.selected);
    if (!sameEndDate) {
      setValue("datetime_until", selectedDate?.dateValue);
    }
  }, [date?.untilOptions]);

  const handleItemSelect = React.useCallback(
    (type: "from" | "until", id?: string) => {
      //if time has been already selected just append selected time
      if (type === "from") {
        const itemIndex: any = date.fromOptions?.findIndex(
          (_item) => _item.id === id
        );
        const _fromOptions = date.fromOptions.map((item) => ({
          ...{ ...item },
          selected: false,
        }));

        _fromOptions[itemIndex] = {
          ..._fromOptions[itemIndex],
          selected: true,
        };
        setDate((_dates) => ({
          ..._dates,
          fromOptions: _fromOptions,
        }));
      }
      if (type === "until") {
        const itemIndex: any = date.untilOptions?.findIndex(
          (_item) => _item.id === id
        );
        // deselect everything
        const _untilOptions = date.untilOptions.map((item) => ({
          ...item,
          selected: false,
        }));
        _untilOptions[itemIndex] = {
          ..._untilOptions[itemIndex],
          selected: true,
        };
        setDate((_dates) => ({
          ..._dates,
          untilOptions: _untilOptions,
        }));
      }
    },
    [date]
  );

  const handleDateAdd = React.useCallback(
    (item: any) => {
      const fromOptions = date.fromOptions.map((item) => ({
        ...item,
        selected: false,
      }));
      const _fromOptions = [...fromOptions, item];
      setDate((prevDate) => ({ ...prevDate, fromOptions: _fromOptions }));
    },
    [date]
  );

  const handleSameDateCheckboxCheck = React.useCallback(() => {
    setSameEndDate((previousValue) => !previousValue);
    const _untilOptions = date?.untilOptions.map((item) => ({
      ...item,
      selected: false,
    }));
    setDate((_dates) => ({
      ..._dates,
      untilOptions: _untilOptions,
    }));
  }, [date?.untilOptions]);

  const fromTimeValue = watch("timeFrom");
  const untilTimeValue = watch("timeUntil");

  const isTimeSelected =
    !!fromTimeValue &&
    fromTimeValue !== "" &&
    !!untilTimeValue &&
    untilTimeValue !== "";

  console.log(watch("datetime_from"));
  console.log(watch("datetime_until"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Box sx={{ display: "flex", mb: 1, justifyContent: "center" }}>
          <Typography variant="h2" sx={{ mr: 1, color: "primary.main" }}>
            Select
          </Typography>
          <Typography variant="h2" sx={{ color: palette?.text?.primary }}>
            date and time
          </Typography>
        </Box>
        <Typography
          sx={{ mt: 1, fontWeight: "bold", color: palette?.text?.primary }}
        >
          Start date
        </Typography>
        <MobileCarousel
          items={date.fromOptions}
          onItemSelect={(item) => handleItemSelect("from", item?.id)}
          onSlotAdd={handleDateAdd}
        />
        {/* <FormControlLabel
          control={
            <Checkbox
              checked={sameEndDate}
              onChange={handleSameDateCheckboxCheck}
              data-testid="same-end-date-checkbox"
              sx={{
                "& .MuiSvgIcon-root": {
                  color: "primary.main",
                },
              }}
            />
          }
          label="End date is same as start date"
          sx={{ color: palette?.text?.primary }}
        /> */}

        <Controller
          name="repeated"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              id="outlined-select-currency"
              select
              label="Start time"
              sx={{ width: "100%", my: 3 }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeIcon />
                  </InputAdornment>
                ),
              }}
            >
              {generateOptionsOrder("from")?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* <Typography
          sx={{ my: 1, fontWeight: "bold", color: palette?.text?.primary }}
        >
          Duration
        </Typography> */}

        {/* <Box sx={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 2 }}> */}
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={!!error}
              type="number"
              sx={{ width: "100%", my: 1 }}
              label="Duration"
              placeholder="Enter activity duration"
              helperText={!!error && "Activity name is required"}
              data-testid="activity-name-input"
            />
          )}
        />

        {/* <Controller
            name="repeated"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                id="outlined-select-currency"
                select
                // label="Does activity repeat?"
                value="h"
                variant="outlined"

                // helperText="Please select your currency"
              >
                {["m", "h", "d"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          /> */}
        {/* </Box> */}

        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          sx={{
            justifyContent: "center",
            mt: 1,
            "& .MuiSvgIcon-root": {
              color: "primary.main",
            },
          }}
          color="primary.main"
        >
          <FormControlLabel
            value="minutes"
            control={<Radio />}
            label="Minutes"
          />
          <FormControlLabel
            value="hours"
            control={<Radio color="primary" />}
            label="Hours"
          />
          <FormControlLabel
            value="days"
            control={<Radio color="primary" />}
            label="Days"
          />
        </RadioGroup>
        {/* </Box> */}

        {/* {!sameEndDate && (
          <MobileCarousel
            items={date.untilOptions}
            // title="Select end date"
            onItemSelect={(item) => handleItemSelect("until", item?.id)}
          />
        )} */}

        {/* <Typography
          sx={{ my: 2, fontWeight: "bold", color: palette?.text?.primary }}
        >
          Start time
        </Typography>

        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Controller
            name="timeFrom"
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TimePicker
                value={value}
                onChange={onChange}
                label="From"
                sx={{ width: "40%", mr: 2 }}
                // onChange={(value: string | null) => {
                //   setTimeValues((previousValues) => ({
                //     ...previousValues,
                //     from: value ?? undefined,
                //   }));
                //   handleTimeChange("datetime_from", value);
                // }}
                options={generateOptionsOrder("from")}
                data-testid="activitiy-from-time-picker"
              />
            )}
          />

          <Typography
            sx={{
              fontWeight: 200,
              fontSize: "2rem",
              color: palette?.text?.primary,
            }}
          >
            -
          </Typography>

          <Controller
            name="timeUntil"
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TimePicker
                value={value}
                onChange={onChange}
                label="Until"
                sx={{ width: "40%", ml: 2 }}
                // onChange={(value: string | null) => {
                //   setTimeValues((previousValues) => ({
                //     ...previousValues,
                //     until: value ?? undefined,
                //   }));
                //   handleTimeChange("datetime_until", value);
                // }}
                options={generateOptionsOrder("until")}
                data-testid="activitiy-to-time-picker"
              />
            )}
          />
        </Box>*/}
      </Box>

      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}
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
          disabled={!isFormValid || !isTimeSelected}
          data-testid="next-btn"
        >
          Next
        </OffliButton>
      </Box>
    </Box>
  );
};
