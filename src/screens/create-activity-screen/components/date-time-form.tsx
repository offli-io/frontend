import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import OffliButton from "../../../components/offli-button";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { format, add } from "date-fns";
import TimePicker from "../../../components/time-picker";
import { ActivityRepetitionOptionsEnum } from "../../../types/common/types";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { getNearestTime } from "../../../utils/nearest-tine.util";
import {
  ICarouselItem,
  MobileCarousel,
} from "../../../components/mobile-carousel";

interface IDateTimeForm {
  onNextClicked: () => void;

  onBackClicked: () => void;
  methods: UseFormReturn;
}

const timeSlots = Array.from(new Array(24 * 2)).map(
  (_, index) =>
    `${index < 20 ? "0" : ""}${Math.floor(index / 2)}:${
      index % 2 === 0 ? "00" : "30"
    }`
);

const generateOptionsOrder = (type: "from" | "until") => {
  const currentHour = new Date().getHours();
  //new Date().getHours() + type === 'from' ? 1 : 2
  const time = `${currentHour}:00`;
  const index = timeSlots?.indexOf(time);
  return timeSlots.slice(index).concat(timeSlots.slice(0, index));
};

//todo oursource into util functions
export const generateDateSlots: (
  isFirstSelected?: boolean
) => ICarouselItem[] = (isFirstSelected?: boolean) => {
  const dateSlots = [] as ICarouselItem[];
  for (let i = 0; i < 5; i++) {
    const date = add(new Date(), {
      days: i,
    });
    dateSlots.push({
      dateValue: date,
      title: format(date, "EEEE").slice(0, 3),
      description: format(date, "dd.MM.yyyy"),
      disabled: false,
      selected: isFirstSelected ? i === 0 : false,
      id: `date_slot_${format(date, "dd.MM.yyyy")}`,
    });
  }
  return dateSlots;
};

function roundMinutes(date: Date) {
  date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
  date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds

  return date;
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
  const currentStartDate = watch("datetime_from");
  const currentEndDate = watch("datetime_until");
  const [date, setDate] = React.useState({
    fromOptions: generateDateSlots(),
    untilOptions: generateDateSlots(),
  });

  const [timeValues, setTimeValues] = React.useState<ITimeValues>({
    from: "",
    until: "",
  });

  const [sameEndDate, setSameEndDate] = React.useState(true);

  const handleTimeChange = React.useCallback(
    (type: "datetime_from" | "datetime_until", value: string | null) => {
      if (value) {
        const timeSplit = value.split(":");
        const _date = currentStartDate
          ? new Date(currentStartDate)
          : new Date();
        _date.setHours(Number(timeSplit[0]), Number(timeSplit[1]), 0);

        setValue(type, _date);
        if (!currentStartDate) {
          const _fromOptions = date?.fromOptions?.map((item, index) =>
            index === 0 ? { ...item, selected: true } : item
          );
          setDate((options) => ({
            ...options,
            fromOptions: _fromOptions,
          }));
        }
      }
    },
    [setValue, watch, currentStartDate, currentStartDate, date]
  );

  console.log(watch("datetime_from"));
  const isFormValid = !!watch("datetime_from") && !!watch("datetime_until");

  React.useEffect(() => {
    const selectedDate = date?.fromOptions?.find((item) => item.selected);

    if (selectedDate) {
      setValue("datetime_from", selectedDate?.dateValue);
      if (sameEndDate) {
        setValue("datetime_until", selectedDate?.dateValue);
      }
    }
  }, [date?.fromOptions]);

  const handleItemSelect = React.useCallback(
    (type: "from" | "until", id?: string) => {
      if (type === "from") {
        const itemIndex: any = date.fromOptions?.findIndex(
          (_item) => _item.id === id
        );
        const _fromOptions = date.fromOptions.map((item) => ({
          ...item,
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

  const isTimeSelected =
    timeValues?.from &&
    timeValues?.from !== "" &&
    timeValues?.until &&
    timeValues?.until !== "";

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
        <FormControlLabel
          control={
            <Checkbox
              checked={sameEndDate}
              onChange={() => {
                setValue("datetime_until", watch("datetime_from"));
                setSameEndDate((previousValue) => !previousValue);
              }}
              data-testid="same-end-date-checkbox"
            />
          }
          label="End date is same as start date"
          sx={{ color: palette?.text?.primary }}
        />

        {!sameEndDate && (
          <MobileCarousel
            items={date.untilOptions}
            // title="Select end date"
            onItemSelect={(item) => handleItemSelect("until", item?.id)}
          />
        )}

        <Typography
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
          <TimePicker
            label="From"
            sx={{ width: "40%", mr: 2 }}
            onChange={(value: string | null) => {
              setTimeValues((previousValues) => ({
                ...previousValues,
                from: value ?? undefined,
              }));
              handleTimeChange("datetime_from", value);
            }}
            options={generateOptionsOrder("from")}
            value={timeValues?.from}
            data-testid="activitiy-from-time-picker"
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

          <TimePicker
            label="To"
            sx={{ width: "40%", ml: 2 }}
            onChange={(value: string | null) => {
              setTimeValues((previousValues) => ({
                ...previousValues,
                until: value ?? undefined,
              }));
              handleTimeChange("datetime_until", value);
            }}
            options={generateOptionsOrder("until")}
            data-testid="activitiy-to-time-picker"
          />
        </Box>
      </Box>

      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}
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
          disabled={!isFormValid || !isTimeSelected}
          data-testid="next-btn"
        >
          Next
        </OffliButton>
      </Box>
    </Box>
  );
};
