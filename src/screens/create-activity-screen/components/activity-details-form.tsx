import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
  useTheme
} from '@mui/material';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import OffliButton from '../../../components/offli-button';
import OffliTextField from '../../../components/offli-text-field';
import { ActivityVisibilityEnum } from '../../../types/activities/activity-visibility-enum.dto';

interface IPlaceFormProps {
  onNextClicked: () => void;
  onBackClicked: () => void;
  methods: UseFormReturn;
}

export const ActivityDetailsForm: React.FC<IPlaceFormProps> = ({
  onNextClicked,
  onBackClicked,
  methods
}) => {
  const { control, formState, setValue } = methods;
  const { palette } = useTheme();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          mt: 1,
          mb: 2,
          justifyContent: 'center',
          width: '100%'
        }}>
        <Typography variant="h1" sx={{ mr: 1, color: palette?.primary?.main }}>
          Activity
        </Typography>
        <Typography variant="h1" sx={{ color: palette?.text?.primary }}>
          details
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          overflow: 'scroll',
          pr: 2
        }}>
        <Controller
          name="visibility"
          control={control}
          render={({ field }) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}>
              <Typography variant="h4" sx={{ mb: 3 }}>
                Attendance & accessibility
              </Typography>
              <Controller
                name="limit"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <OffliTextField
                    {...field}
                    type="number"
                    error={!!error}
                    sx={{ width: '100%', mb: 3 }}
                    label="How many people can attend activity ?"
                    placeholder="Type activity capacity"
                    data-testid="limit-input"
                  />
                )}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}>
                <Typography sx={{ fontSize: 'bold', color: palette?.text?.primary }}>
                  Who can join the activity ?
                </Typography>
                <RadioGroup
                  {...field}
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  sx={{
                    justifyContent: 'center',
                    mt: 1,
                    '& .MuiSvgIcon-root': {
                      color: 'primary.main'
                    },
                    ml: 2
                  }}
                  color="primary.main">
                  <FormControlLabel
                    value={ActivityVisibilityEnum.public}
                    control={<Radio />}
                    label="Anyone"
                    data-testid="public-activity-radio"
                  />
                  <FormControlLabel
                    value={ActivityVisibilityEnum.private}
                    control={<Radio color="primary" />}
                    label="Invited users only"
                    data-testid="private-activity-radio"
                  />
                </RadioGroup>
              </Box>
              <Typography variant="h4" sx={{ mb: 3, mt: 3 }}>
                Fees & description
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  width: '100%'
                }}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <OffliTextField
                      {...field}
                      id="outlined-select-currency"
                      // sx={{ width: "100%", mb: 5 }}
                      value={field?.value ?? ''}
                      label="Any fees?"
                      data-testid="price-input"
                      error={!!error}
                      helperText={error?.message}
                      sx={{ width: '100%' }}
                      onChange={(e) => {
                        const value = e?.target?.value;
                        if (value?.length > 0) {
                          setValue('isActivityFree', false);
                        }
                        field?.onChange(value);
                      }}
                      onBlur={(e) => {
                        if (e?.target?.value?.length === 0) {
                          field?.onChange(0);
                        }
                      }}
                      type="number"
                    />
                  )}
                />

                <Controller
                  name="isActivityFree"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value}
                          onChange={(e) => {
                            if (e?.target?.checked) {
                              setValue('price', 0);
                            }
                            onChange(e?.target?.checked ? true : false);
                          }}
                          data-testid="same-end-date-checkbox"
                          sx={{
                            '& .MuiSvgIcon-root': {
                              color: 'primary.main'
                            }
                          }}
                          // sx={{ mr: 2 }}
                        />
                      }
                      label="Free"
                      sx={{
                        color: palette?.text?.primary,
                        ml: 2
                      }}
                    />
                  )}
                />
              </Box>
            </Box>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <OffliTextField
              {...field}
              multiline
              rows={3}
              error={!!error}
              label="Additional description"
              placeholder="Type more info about the activity"
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  height: 'unset'
                },
                mt: 2
              }}
              inputProps={{ maxLength: 200 }}
              helperText={`${field?.value?.length ?? 0}/200`}
              autoCapitalize="sentences"
              data-testid="description-input"
            />
          )}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          mt: 2
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
          disabled={!formState.isValid}
          data-testid="next-btn">
          Next
        </OffliButton>
      </Box>
    </>
  );
};
