import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {
  Box,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { ActivityDurationTypeEnumDto } from 'types/activities/activity-duration-type-enum.dto';
import { DATE_TIME_FORMAT } from 'utils/common-constants';
import { MobileCarousel } from '../../../components/mobile-carousel';
import OffliButton from '../../../components/offli-button';
import { calculateDateUsingDuration } from '../utils/calculate-date-using-duration.util';
import { generateDateSlots } from '../utils/generate-date-slots.util';
import { generateOptionsOrder } from '../utils/generate-options-order.util';

interface IDateTimeForm {
  onNextClicked: () => void;

  onBackClicked: () => void;
  methods: UseFormReturn;
}

export const DateTimeForm: React.FC<IDateTimeForm> = ({
  onNextClicked,
  onBackClicked,
  methods
}) => {
  const { control, watch, setValue } = methods;
  const { palette } = useTheme();
  const [date, setDate] = React.useState({
    fromOptions: generateDateSlots(),
    untilOptions: generateDateSlots()
  });

  const isFormValid = !!watch('datetime_from');

  React.useEffect(() => {
    const selectedDate = date?.fromOptions?.find((item) => item.selected);
    if (selectedDate) {
      setValue('datetime_from', selectedDate?.dateValue);
    }
  }, [date?.fromOptions]);

  const handleItemSelect = React.useCallback(
    (type: 'from' | 'until', id?: string) => {
      //if time has been already selected just append selected time
      if (type === 'from') {
        const itemIndex: any = date.fromOptions?.findIndex((_item) => _item.id === id);
        const _fromOptions = date.fromOptions.map((item) => ({
          ...{ ...item },
          selected: false
        }));

        _fromOptions[itemIndex] = {
          ..._fromOptions[itemIndex],
          selected: true
        };
        setDate((_dates) => ({
          ..._dates,
          fromOptions: _fromOptions
        }));
      }
      if (type === 'until') {
        const itemIndex: any = date.untilOptions?.findIndex((_item) => _item.id === id);
        // deselect everything
        const _untilOptions = date.untilOptions.map((item) => ({
          ...item,
          selected: false
        }));
        _untilOptions[itemIndex] = {
          ..._untilOptions[itemIndex],
          selected: true
        };
        setDate((_dates) => ({
          ..._dates,
          untilOptions: _untilOptions
        }));
      }
    },
    [date]
  );

  const handleDateAdd = React.useCallback(
    (item: any) => {
      const fromOptions = date.fromOptions.map((item) => ({
        ...item,
        selected: false
      }));
      const _fromOptions = [...fromOptions, item];
      setDate((prevDate) => ({ ...prevDate, fromOptions: _fromOptions }));
    },
    [date]
  );

  const datetimeFrom = watch('datetime_from');
  const fromTimeValue = watch('timeFrom');
  //TODO why duration isn't caught by validation error with yup?
  const duration = watch('duration');
  const durationType = watch('durationType');

  const isTimeSelected = !!fromTimeValue && fromTimeValue !== '';

  const displayEndingTime = isTimeSelected && !!datetimeFrom && !!duration;

  const { datetimeUntil } = calculateDateUsingDuration({
    timeFrom: fromTimeValue,
    datetimeFrom,
    duration,
    durationType
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        justifyContent: 'space-evenly'
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box sx={{ display: 'flex', mb: 2, mt: 1, justifyContent: 'center' }}>
          <Typography variant="h1" sx={{ mr: 1, color: palette?.primary?.main }}>
            Select
          </Typography>
          <Typography variant="h1" sx={{ color: palette?.text?.primary }}>
            date and time
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ color: palette?.text?.primary }}>
          Start date
        </Typography>
        <MobileCarousel
          items={date.fromOptions}
          onItemSelect={(item) => handleItemSelect('from', item?.id)}
          onSlotAdd={handleDateAdd}
        />

        <Typography variant="h4" sx={{ mt: 2, mb: 1, color: palette?.text?.primary }}>
          Start time
        </Typography>
        <Controller
          name="timeFrom"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              id="outlined-select-currency"
              select
              sx={{ width: '100%', mb: 1 }}
              variant="outlined"
              data-testid="activitiy-from-time-picker"
              error={!!error}
              helperText={!!error && 'Activity start time is required'}
              SelectProps={{
                MenuProps: {
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                  },
                  style: { height: '40%' }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <AccessTimeIcon sx={{ mr: 2 }} />
                  </InputAdornment>
                )
              }}>
              {generateOptionsOrder()?.map((option) => (
                <MenuItem key={option} value={option} divider>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Typography variant="h4" sx={{ mt: 2, mb: 1, color: palette?.text?.primary }}>
          Activity duration
        </Typography>
        <Controller
          name="duration"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={!!error}
              type="number"
              sx={{ width: '100%' }}
              // label="Duration"
              placeholder="Enter activity duration"
              helperText={!!error && 'Activity duration is required'}
              data-testid="activity-name-input"
            />
          )}
        />

        <Controller
          name="durationType"
          control={control}
          render={({ field }) => (
            <RadioGroup
              {...field}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              sx={{
                justifyContent: 'center',
                mt: 1,
                mb: 1,
                '& .MuiSvgIcon-root': {
                  color: 'primary.main'
                }
              }}
              color="primary.main">
              <FormControlLabel
                value={ActivityDurationTypeEnumDto.MINUTES}
                control={<Radio />}
                label={ActivityDurationTypeEnumDto.MINUTES}
              />
              <FormControlLabel
                value={ActivityDurationTypeEnumDto.HOURS}
                control={<Radio color="primary" />}
                label={ActivityDurationTypeEnumDto.HOURS}
              />
              <FormControlLabel
                value={ActivityDurationTypeEnumDto.DAYS}
                control={<Radio color="primary" />}
                label={ActivityDurationTypeEnumDto.DAYS}
              />
            </RadioGroup>
          )}
        />
        {displayEndingTime ? (
          <Typography
            variant="subtitle2"
            sx={{
              textAlign: 'center',
              fontSize: 14,
              my: 1.2,
              fontWeight: 'bold'
            }}>{`Ending ${format(datetimeUntil, DATE_TIME_FORMAT)}`}</Typography>
        ) : null}
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          mt: 1
        }}>
        <IconButton
          onClick={onBackClicked}
          color="primary"
          data-testid="back-btn"
          sx={{ fontSize: 20 }}>
          <ArrowBackIosNewIcon sx={{ color: 'inherit', mr: 1 }} />
          Back
        </IconButton>

        <OffliButton
          onClick={onNextClicked}
          sx={{ width: '40%', height: 50 }}
          disabled={!isFormValid || !isTimeSelected}
          data-testid="next-btn">
          Next
        </OffliButton>
      </Box>
    </Box>
  );
};
