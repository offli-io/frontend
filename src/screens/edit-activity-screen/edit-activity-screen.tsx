import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  useTheme,
  FormControlLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  ACTIVITY_FEE_OPTIONS,
  MAX_ACTIVITY_ATTENDANCE,
  MAX_ACTIVITY_DESC_LENGTH,
  MIN_ACTIVITY_ATTENDANCE,
} from "../../utils/activities-constants";
import ActionButton from "../../components/action-button";
import { useTags } from "../../hooks/use-tags";
import { IPredefinedTagDto } from "../../types/activities/predefined-tag.dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
// import { updateActivityInfo } from "../../api/activities/requests";
import { IUpdateActivityRequestDto } from "../../types/activities/update-activity-request.dto";
import { IActivityRestDto } from "../../types/activities/activity-rest.dto";
import { getLocationFromQueryFetch } from "../../api/activities/requests";
import { useDebounce } from "use-debounce";
import { mapLocationValue } from "../../utils/map-location-value.util";
import { ILocation } from "../../types/activities/location.dto";

interface IEditActivity {
  title: string;
  location?: ILocation | null;
  startDateTime: Date | string;
  endDateTime: Date | string;
  isPrivate: boolean;
  maxAttendance: number;
  price: string;
  additionalDesc: string;
  placeQuery?: string;
}

interface ICategoryTag {
  title: string;
  active: boolean;
}

const schema: () => yup.SchemaOf<IEditActivity> = () =>
  yup.object({
    title: yup.string().defined().required("Please enter the Title"),
    location: yup
      .object({
        name: yup.string().defined().required(),
        coordinates: yup.object({
          lat: yup.number().defined().required(),
          lon: yup.number().defined().required(),
        }),
      })
      .notRequired(),
    startDateTime: yup.date().defined().required("Please enter the Start Date"),
    endDateTime: yup.date().defined().required("Please enter the End Date"),
    isPrivate: yup.boolean().defined(),
    maxAttendance: yup
      .number()
      .defined()
      .required("Please enter How many people can attend"),
    price: yup.string().defined().required("Please enter the Price"),
    additionalDesc: yup
      .string()
      .defined()
      .required("Please enter the Description"),
    // about_me: yup.string().defined().required("Please enter your aboutMe"),
    // location: yup.string().defined().required("Please enter your location"),
    // birthdate: yup.date().nullable().required("Please enter your birthDate"),
    // instagram: yup
    //   .string()
    //   .defined()
    //   .required("Please enter your instagramUsername"),
    placeQuery: yup.string().notRequired(),
  });

const EditActivityScreen: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const lodash = require("lodash"); // to create array within given range easily

  const [categoryTags, setCategoryTags] = useState<ICategoryTag[]>([]); /// TODO dat prec | null
  const [activeCategoryTags, setActiveCategoryTags] = useState<string[]>([]);

  const { data: predefinedTags } = useTags();
  const { data: { data: { activity = {} } = {} } = {}, isLoading } =
    useActivities<IActivityRestDto>({
      id: Number(id),
    });

  // console.log(activity);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { dirtyFields = [], isValid },
  } = useForm<IEditActivity>({
    defaultValues: {
      title: "",
      location: null,
      startDateTime: new Date(), // TODO: pridava 2 hodiny kvoli timezone
      endDateTime: new Date(), // TODO: pridava 2 hodiny kvoli timezone
      isPrivate: true,
      maxAttendance: MAX_ACTIVITY_ATTENDANCE,
      price: "",
      additionalDesc: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  const [queryString] = useDebounce(watch("placeQuery"), 1000);

  const placeQuery = useQuery(
    ["locations", queryString],
    (props) => getLocationFromQueryFetch(String(queryString)),
    {
      enabled: !!queryString,
    }
  );

  // useEffect(() => {
  //   // if predefinedTag is included in activity tags, set tag`s active param to true and vice versa,
  //   // also add active tags to activeCategoryTags, for easier insert of tags into PUT request
  //   console.log("useeffect");

  //   let tagsTmp: ICategoryTag[] = [];
  //   let activeTagsTmp: string[] = [];
  //   if (predefinedTags?.data?.tags && predefinedTags?.data?.tags?.length > 0) {
  //     if (activity?.tags && activity?.tags?.length > 0) {
  //       predefinedTags?.data?.tags.map((tag) => {
  //         if (activity?.tags?.includes(tag?.title)) {
  //           tagsTmp.push({ title: tag?.title, active: true });
  //           activeTagsTmp.push(tag?.title);
  //         }
  //         if (activity?.tags?.includes(tag?.title)) {
  //           tagsTmp.push({ title: tag?.title, active: false });
  //         } else {
  //           return;
  //         }
  //       });
  //       setCategoryTags(tagsTmp);
  //       setActiveCategoryTags(activeTagsTmp);
  //     }
  //   }
  // }, [predefinedTags, activity]);

  const handleChipClick = (index: number, title: string) => {
    if (categoryTags) {
      var newTagsArr = [...categoryTags];
      newTagsArr[index].active = !newTagsArr[index].active;
      setCategoryTags(newTagsArr);
    }

    // mozno staci len na handleSubmit dat .filter(kde sa (ne)rovna active)
    if (activeCategoryTags) {
      var newActiveTagsArr = [...activeCategoryTags];
      if (activeCategoryTags.includes(title)) {
        newActiveTagsArr = activeCategoryTags.filter(function (e) {
          return e !== title;
        });
      }
      if (!activeCategoryTags.includes(title)) {
        newActiveTagsArr.push(title);
      }
      setActiveCategoryTags(newActiveTagsArr);
    }
  };

  useEffect(() => {
    const dateTimeFrom = activity?.datetime_from
      ? new Date(activity?.datetime_from)
      : null;
    const dateTimeUntil = activity?.datetime_until
      ? new Date(activity?.datetime_until)
      : null;

    const recievedVisibility = activity?.visibility;
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
      title: activity?.title,
      location: activity?.location,
      startDateTime: dateTimeFrom?.toString(),
      endDateTime: dateTimeUntil?.toString(),
      isPrivate: isPrivateA,
      maxAttendance: activity?.limit,
      price: activity?.price,
      additionalDesc: activity?.description,
    });
  }, [activity]);

  // const { mutate: sendUpdateActivity } = useMutation(
  //   ["update-profile-info"],
  //   (values: IUpdateActivityRequestDto) => updateActivityInfo(id, values),
  //   {
  //     onSuccess: (data, variables) => {
  //       // queryClient.invalidateQueries(["users"]);
  //       enqueueSnackbar("Activity information was successfully updated", {
  //         variant: "success",
  //       });
  //       // navigate(ApplicationLocations.ACTIVITIES);
  //     },
  //     onError: () => {
  //       enqueueSnackbar("Failed to update activity info", {
  //         variant: "error",
  //       });
  //     },
  //   }
  // );

  const handleFormSubmit = React.useCallback(
    (values: IEditActivity) => {
      // console.log(values);

      let newValues = {};

      console.log(dirtyFields);

      Object.keys(dirtyFields).forEach((field: string) => {
        newValues = { ...newValues, [field]: (values as any)?.[field] };
      });

      // newValues = { ...newValues, tags: }

      console.log(newValues);

      // sendUpdateActivity({
      //   title: values.title,
      //   location: values.location,
      //   startDateTime: values.startDateTime.toISOString(),
      //   endDateTime: values.endDateTime.toISOString(),
      //   isPrivate: values.isPrivate,
      //   maxAttendance: values.maxAttendance,
      //   price: values.price,
      //   additionalDesc: values.additionalDesc,
      // });

      // var newActiveTagsArr = categoryTags?.filter(function (e) {
      //   return e.active !== true;
      // });
      // console.log(newActiveTagsArr);
    },
    [dirtyFields]
  );

  return (
    <>
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
            src={activity?.title_picture_url}
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
            {/* <Controller
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
            /> */}
            <Controller
              name="location"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Autocomplete
                  {...field}
                  options={placeQuery?.data?.results ?? []}
                  value={mapLocationValue(field?.value)}
                  isOptionEqualToValue={(option, value) =>
                    option?.formatted === (value?.formatted ?? value?.name)
                  }
                  sx={{
                    width: "95%",
                    mt: 3,
                  }}
                  loading={placeQuery?.isLoading}
                  onChange={(e, locationObject) =>
                    field.onChange({
                      name: locationObject?.formatted,
                      coordinates: {
                        lat: locationObject?.lat,
                        lon: locationObject?.lon,
                      },
                    })
                  }
                  getOptionLabel={(option) => String(option?.formatted)}
                  // inputValue={inputValue ?? ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search place"
                      // onChange={(e) => setValue("placeQuery", e.target.value)}
                      onChange={(e) => console.log(e.target.value)}
                    />
                  )}
                  data-testid="activity-place-input"
                />
              )}
            />
            {/* nwm ci by v LocalizationProvider mali byt Boxy a veci co sa netykaju DateTimePickeru, ked tak vyhodit */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sk">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "95%",
                  mt: 3,
                }}
              >
                <Box sx={{ mr: 1 }}>
                  <Controller
                    name="startDateTime"
                    control={control}
                    render={({
                      field: { onChange, ...field },
                      fieldState: { error },
                    }) => (
                      <DateTimePicker
                        {...field}
                        label="Start DateTime"
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
                              // backgroundColor: `${theme.palette.primary.light}`,
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
                <Box sx={{ ml: 1 }}>
                  <Controller
                    name="endDateTime"
                    control={control}
                    render={({
                      field: { onChange, ...field },
                      fieldState: { error },
                    }) => (
                      <DateTimePicker
                        {...field}
                        label="End DateTime"
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
                              // backgroundColor: `${theme.palette.primary.light}`,
                              // fontSize: "bold",
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
                mt: 2,
              }}
            >
              {/* ///////////////////////////////////////////////////////////////////////////////// ACCESIBILITY */}

              <Typography variant="h6" sx={{ width: "100%", ml: 0.5 }}>
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
                        // {...field} // TODO: jebe error kvoli ref
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
                  label="How many people can attend?"
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
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
                  label="Any fees?"
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  //disabled={methodSelectionDisabled}
                  sx={{ width: "95%", mt: 3 }}
                >
                  {ACTIVITY_FEE_OPTIONS.map((item: string) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {/* ///////////////////////////////////////////////////////////////////////////////// ADDITIONAL DESC */}
            <Controller
              name="additionalDesc"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  multiline
                  label="Additional description"
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ maxLength: MAX_ACTIVITY_DESC_LENGTH }}
                  //disabled={methodSelectionDisabled}
                  sx={{ width: "95%", mt: 3 }}
                />
              )}
            />
            {/* ///////////////////////////////////////////////////////////////////////////////// CATEGORY / TAGS */}
            {categoryTags && categoryTags.length > 0 && (
              <>
                <Typography variant="h6" sx={{ width: "100%", mt: 2 }}>
                  <b>Category</b>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    mt: 0.5,
                  }}
                >
                  {categoryTags.map((tag: ICategoryTag, index) => (
                    <Chip
                      label={tag?.title}
                      key={tag?.title}
                      sx={{ mr: 0.2, borderRadius: "8px" }}
                      color="primary"
                      variant={tag?.active ? "filled" : "outlined"}
                      onClick={() => handleChipClick(index, tag.title)}
                    />
                  ))}
                </Box>
              </>
            )}

            {/* ///////////////////////////////////////////////////////////////////////////////// SUBMIT BTN */}
            <ActionButton
              type="submit"
              text="Save"
              sx={{ mt: 4 }}
              disabled={!isValid}
            />
          </form>
        </Box>
      </PageWrapper>
    </>
  );
};
export default EditActivityScreen;
