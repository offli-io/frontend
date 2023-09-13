import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormLabel,
  IconButton,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import OffliButton from "../../../components/offli-button";
import { ActivityVisibilityEnum } from "../../../types/activities/activity-visibility-enum.dto";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

interface IPlaceFormProps {
  onNextClicked: () => void;
  onBackClicked: () => void;
  methods: UseFormReturn;
}

export const ActivityDetailsForm: React.FC<IPlaceFormProps> = ({
  onNextClicked,
  onBackClicked,
  methods,
}) => {
  const { control, formState, setValue, watch } = methods;
  const { palette } = useTheme();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            mb: 2,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Typography variant="h2" sx={{ color: palette?.text?.primary }}>
            Activity details
          </Typography>
        </Box>
        <Controller
          name="visibility"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-around",
                  mb: 5,
                }}
              >
                <Typography
                  sx={{ fontWeight: "bold", color: palette?.text?.primary }}
                >
                  Accessibility
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Switch
                    sx={{ mx: 1 }}
                    value={
                      field?.value === ActivityVisibilityEnum.private
                        ? false
                        : true
                    }
                    checked={
                      field?.value === ActivityVisibilityEnum.private
                        ? false
                        : true
                    }
                    onChange={(e) => {
                      field.onChange(
                        e.target.checked
                          ? ActivityVisibilityEnum.public
                          : ActivityVisibilityEnum.private
                      );
                    }}
                    color="primary"
                    data-testid="accessibility-switch"
                  />
                  <FormLabel>public</FormLabel>
                </Box>
              </Box>

              <Controller
                name="limit"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    error={!!error}
                    sx={{ width: "100%", mb: 5 }}
                    label="How many people can attend"
                    placeholder="Type activity capacity"
                    data-testid="limit-input"
                  />
                )}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 5,
                  width: "100%",
                }}
              >
                <Controller
                  name="price"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      id="outlined-select-currency"
                      // sx={{ width: "100%", mb: 5 }}
                      value={field?.value ?? ""}
                      label="Any fees?"
                      data-testid="price-input"
                      error={!!error}
                      helperText={error?.message}
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        const value = e?.target?.value;
                        if (value?.length > 0) {
                          setValue("isActivityFree", false);
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
                  render={({
                    field: { value, onChange, ...field },
                    fieldState: { error },
                  }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value}
                          onChange={(e) => {
                            if (e?.target?.checked) {
                              setValue("price", 0);
                            }
                            onChange(e?.target?.checked ? true : false);
                          }}
                          data-testid="same-end-date-checkbox"
                          sx={{
                            "& .MuiSvgIcon-root": {
                              color: "primary.main",
                            },
                          }}
                          // sx={{ mr: 2 }}
                        />
                      }
                      label="Free"
                      sx={{
                        color: palette?.text?.primary,
                        ml: 2,
                      }}
                    />
                  )}
                />
              </Box>

              {/* 
              TODO FOR v2 maybe
              <Controller
                name="repeated"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id="outlined-select-currency"
                    select
                    label="Does activity repeat?"
                    sx={{ width: '100%', mb: 5 }}
                    // helperText="Please select your currency"
                  >
                    {Object.values(ActivityRepetitionOptionsEnum).map(
                      option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                )}
              /> */}
            </Box>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              multiline
              rows={3}
              error={!!error}
              label="Additional description"
              placeholder="Type more info about the activity"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  height: "unset",
                },
              }}
              inputProps={{ maxLength: 200 }}
              helperText={`${field?.value?.length ?? 0}/200`}
              data-testid="description-input"
            />
          )}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
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
