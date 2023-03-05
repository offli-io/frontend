import {
  Box,
  Typography,
  TextField,
  useTheme,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import BackHeader from "../../components/back-header";
import { ICustomizedLocationStateDto } from "../../types/common/customized-location-state.dto";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useActivities } from "../../hooks/use-activities";
import { PageWrapper } from "../../components/page-wrapper";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/sk";
import { IOSSwitch } from "./components/ios-switch";
import { ActivityVisibilityEnum } from "../../types/activities/activity-visibility-enum.dto";
import {
  MAX_ACTIVITY_ATTENDANCE,
  MIN_ACTIVITY_ATTENDANCE,
} from "../../utils/activities-constants";
import ActionButton from "../../components/action-button";
interface IProps {}

interface IEditActivity {
  title: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  isPrivate: boolean | undefined;
  maxAttendance: number;
  price: string;
  // startTime: Dayjs | undefined;
}

const schema: () => yup.SchemaOf<IEditActivity> = () =>
  yup.object({
    title: yup.string().defined().required("Please enter the Title"),
    location: yup.string().defined().required("Please enter the Location"),
    startDateTime: yup.date().defined().required("Please enter the Start Date"),
    endDateTime: yup.date().defined().required("Please enter the End Date"),
    isPrivate: yup.boolean(),
    maxAttendance: yup
      .number()
      .defined()
      .required("Please enter How many people can attend"),
    price: yup.string().defined().required("Please enter the Fee"),
    // about_me: yup.string().defined().required("Please enter your aboutMe"),
    // location: yup.string().defined().required("Please enter your location"),
    // birthdate: yup.date().nullable().required("Please enter your birthDate"),
    // instagram: yup
    //   .string()
    //   .defined()
    //   .required("Please enter your instagramUsername"),
  });

const EditActivityScreen: React.FC<IProps> = () => {
  const { id } = useParams();
  const location = useLocation();
  const from = (location?.state as ICustomizedLocationStateDto)?.from;
  const theme = useTheme();

  const { data: { data = {} } = {} }: any = useActivities({ id });

  const lodash = require("lodash"); // to create array within range easily
  console.log(data);

  const { control, handleSubmit, reset, formState } = useForm<IEditActivity>({
    defaultValues: {
      title: "",
      location: "",
      startDateTime: new Date(), // TODO: pridava 2 hodiny kvoli timezone
      endDateTime: new Date(), // TODO: pridava 2 hodiny kvoli timezone
      isPrivate: true,
      maxAttendance: MAX_ACTIVITY_ATTENDANCE,
      price: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  useEffect(() => {
    const recievedStartDateTime = new Date(data?.activity?.datetime_from);
    const recievedEndDateTime = new Date(data?.activity?.datetime_until);

    const recievedVisibility = data?.activity?.visibility;
    let isPrivateA = false;
    if (recievedVisibility) {
      if (recievedVisibility === ActivityVisibilityEnum.private) {
        isPrivateA = true;
      }
      if (recievedVisibility === ActivityVisibilityEnum.public) {
        isPrivateA = false;
      }
    }

    reset({
      title: data?.activity?.title,
      location: data?.activity?.location?.name,
      startDateTime: recievedStartDateTime,
      endDateTime: recievedEndDateTime,
      isPrivate: isPrivateA,
      maxAttendance: data?.activity?.limit,
      price: data?.activity?.price,
    });
  }, [data]);

  const handleFormSubmit = React.useCallback((values: IEditActivity) => {
    //OnSuccess
    // queryClient.invalidateQueries(['user-info'])
    // navigate(ApplicationLocations.PROFILE)
    //sendUpdateProfile(values);
    console.log(values);
  }, []);

  return (
    <>
      <BackHeader title="Edit Activity" to={from} />
      <PageWrapper>
        <Box
          sx={{
            // mt: (HEADER_HEIGHT + 16) / 12,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img
            onClick={() => console.log("change profile photo")}
            // todo add default picture in case of missing photo
            src={data?.activity?.title_picture}
            alt="profile"
            style={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              //border: `3px solid ${theme.palette.primary.main}`,
            }}
          />
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "86%",
            }}
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Title"
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  //disabled={methodSelectionDisabled}
                  sx={{ width: "95%", mt: 3 }}
                />
              )}
            />
            <Controller
              name="location"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Location"
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  //disabled={methodSelectionDisabled}
                  sx={{ width: "95%", mt: 2 }}
                />
              )}
            />
            {/* nwm ci by v LocalizationProvider mali byt Boxy a veci co sa netykaju DateTimePickeru, ked tak vyhodit */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sk">
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box sx={{ mr: 1 }}>
                  {/* ///////////////////////////////////////////////////////////////////////////////// START DATETIME */}

                  <Typography variant="h6" sx={{ width: "100%", mt: 2, ml: 1 }}>
                    <b>Start</b>
                  </Typography>
                  <Controller
                    name="startDateTime"
                    control={control}
                    render={({
                      field: { onChange, ...field },
                      fieldState: { error },
                    }) => (
                      <DateTimePicker
                        {...field}
                        onChange={(e) => onChange(e)}
                        renderInput={(params) => (
                          <TextField
                            variant="outlined"
                            error={!!error}
                            helperText={error?.message}
                            //disabled={methodSelectionDisabled}
                            sx={{
                              width: "100%",
                              borderRadius: "12px",
                              backgroundColor: `${theme.palette.primary.light}`,
                              fontSize: "bold",
                              input: {
                                color: `${theme.palette.primary.main}`,
                                fontWeight: "bold",
                              },
                            }}
                            {...params}
                          />
                        )}
                      />
                    )}
                  />
                </Box>
                {/* ///////////////////////////////////////////////////////////////////////////////// END DATETIME */}

                <Box sx={{ ml: 1 }}>
                  <Typography variant="h6" sx={{ width: "100%", mt: 2, ml: 1 }}>
                    <b>End</b>
                  </Typography>
                  <Controller
                    name="endDateTime"
                    control={control}
                    render={({
                      field: { onChange, ...field },
                      fieldState: { error },
                    }) => (
                      <DateTimePicker
                        {...field}
                        onChange={(e) => onChange(e)}
                        renderInput={(params) => (
                          <TextField
                            variant="outlined"
                            error={!!error}
                            helperText={error?.message}
                            //disabled={methodSelectionDisabled}
                            sx={{
                              width: "100%",
                              borderRadius: "12px",
                              backgroundColor: `${theme.palette.primary.light}`,
                              fontSize: "bold",
                              input: {
                                color: `${theme.palette.primary.main}`,
                                fontWeight: "bold",
                              },
                            }}
                            {...params}
                          />
                        )}
                      />
                    )}
                  />
                </Box>
              </Box>
            </LocalizationProvider>
            <Box
              sx={{
                width: "95%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 3,
              }}
            >
              {/* ///////////////////////////////////////////////////////////////////////////////// ACCESIBILITY */}

              <Typography variant="h6" sx={{ width: "100%" }}>
                <b>Accessibility</b>
              </Typography>
              <Controller
                name="isPrivate"
                control={control}
                render={({
                  field: { value, onChange, ...field },
                  fieldState: { error },
                }) => (
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        {...field}
                        onChange={(e) => onChange(e.target.checked)}
                        checked={value}
                        sx={{ ml: 1, mr: 1.7 }}
                      />
                    }
                    labelPlacement="start"
                    label={value ? "private" : "public"}
                  ></FormControlLabel>
                )}
              />
            </Box>
            {/* ///////////////////////////////////////////////////////////////////////////////// MAX ATTENDANCE */}
            <Controller
              name="maxAttendance"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  select
                  {...field}
                  label="Attendance Limit"
                  variant="outlined"
                  error={!!error}
                  // helperText={error?.message}
                  //disabled={methodSelectionDisabled}
                  sx={{ width: "95%", mt: 3 }}
                >
                  {lodash
                    .range(
                      MIN_ACTIVITY_ATTENDANCE,
                      MAX_ACTIVITY_ATTENDANCE + 1,
                      1
                    )
                    .map((item: number) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            />
            {/* ///////////////////////////////////////////////////////////////////////////////// PRICE */}

            <Controller
              name="price"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  select
                  {...field}
                  label="Attendance Limit"
                  variant="outlined"
                  error={!!error}
                  // helperText={error?.message}
                  //disabled={methodSelectionDisabled}
                  sx={{ width: "95%", mt: 3 }}
                >
                  {lodash
                    .range(
                      MIN_ACTIVITY_ATTENDANCE,
                      MAX_ACTIVITY_ATTENDANCE + 1,
                      1
                    )
                    .map((item: number) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            />

            {/* </Box> */}
            <ActionButton
              type="submit"
              text="Save"
              // sx={{ width: "100% !important" }}
              disabled={!formState.isValid}
            />
          </form>
        </Box>
      </PageWrapper>
    </>
  );
};
export default EditActivityScreen;
