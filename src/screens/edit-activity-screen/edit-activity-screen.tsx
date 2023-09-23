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
  Switch,
  FormLabel,
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
  ACTIVITY_VISIBILITY_OPTIONS,
  MAX_ACTIVITY_ATTENDANCE,
  MAX_ACTIVITY_DESC_LENGTH,
  MIN_ACTIVITY_ATTENDANCE,
} from "../../utils/activities-constants";
import ActionButton from "../../components/action-button";
import { useTags } from "../../hooks/use-tags";
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
import { useGetApiUrl } from "../../hooks/use-get-api-url";
import { IActivity } from "types/activities/activity.dto";
import {
  IAdditionalHelperActivityInterface,
  validationSchema,
} from "./utils/validation-schema";

interface ICategoryTag {
  title: string;
  active: boolean;
}

const EditActivityScreen: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const baseUrl = useGetApiUrl();

  const lodash = require("lodash"); // to create array within given range easily

  const [categoryTags, setCategoryTags] = useState<ICategoryTag[]>([]); /// TODO dat prec | null
  const [activeCategoryTags, setActiveCategoryTags] = useState<string[]>([]);

  const { data: { data: { tags: predefinedTags = [] } = {} } = {} } = useTags();

  const mappedTags = predefinedTags?.map(({ title }) => title);

  const { data: { data: { activity = {} } = {} } = {}, isLoading } =
    useActivities<IActivityRestDto>({
      params: {
        id: Number(id),
      },
    });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { dirtyFields = [], isValid },
  } = useForm<IActivity & IAdditionalHelperActivityInterface>({
    defaultValues: {
      title: "",
      description: "",
      location: null,
      datetime_from: new Date(), // TODO: pridava 2 hodiny kvoli timezone
      datetime_until: new Date(), // TODO: pridava 2 hodiny kvoli timezone
      visibility: ActivityVisibilityEnum.public,
      // limit: '',
      // price: 0,
      tags: [],
    },
    resolver: yupResolver(validationSchema()),
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

  useEffect(() => {
    reset({
      ...activity,
      datetime_from: activity?.datetime_from?.toString(),
      datetime_until: activity?.datetime_until?.toString(),
    });
  }, [activity]);

  console.log(watch("tags"));

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
    (values: IActivity) => {
      // console.log(values);

      // let newValues = {};

      // console.log(dirtyFields);

      // Object.keys(dirtyFields).forEach((field: string) => {
      //   newValues = { ...newValues, [field]: (values as any)?.[field] };
      // });

      // newValues = { ...newValues, tags: }

      console.log(values);

      // sendUpdateActivity({
      //   title: values.title,
      //   location: values.location,
      //   startDateTime: values.startDateTime.toISOString(),
      //   endDateTime: values.endDateTime.toISOString(),
      //   accessibility: values.accessibility,
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
            src={`${baseUrl}/files/${activity?.title_picture}`}
            alt="profile"
            style={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              border: `3.5px solid ${theme.palette.primary.main}`,
              marginTop: 10,
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
            <Typography variant="h6" sx={{ width: "95%", mt: 1 }}>
              <b>General Info</b>
            </Typography>

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
                  sx={{ width: "100%", mt: 2 }}
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
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                  }}
                  loading={placeQuery?.isLoading}
                  onChange={(e, locationObject) => {
                    field.onChange(
                      locationObject
                        ? {
                            name: locationObject?.formatted,
                            coordinates: {
                              lat: locationObject?.lat,
                              lon: locationObject?.lon,
                            },
                          }
                        : null
                    );
                  }}
                  getOptionLabel={(option) => String(option?.formatted)}
                  // inputValue={inputValue ?? ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search place"
                      onChange={(e) => setValue("placeQuery", e.target.value)}
                    />
                  )}
                  data-testid="activity-place-input"
                />
              )}
            />
            {/* nwm ci by v LocalizationProvider mali byt Boxy a veci co sa netykaju DateTimePickeru, ked tak vyhodit */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sk">
              <Controller
                name="datetime_from"
                control={control}
                render={({
                  field: { onChange, ...field },
                  fieldState: { error },
                }) => (
                  <DateTimePicker
                    {...field}
                    label="Start date"
                    onChange={(e) => onChange(e)}
                    renderInput={(params) => (
                      <TextField
                        variant="outlined"
                        error={!!error}
                        helperText={error?.message}
                        //disabled={methodSelectionDisabled}
                        sx={{
                          width: "100%",
                          mt: 3, // backgroundColor: `${theme.palette.primary.light}`,
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
              <Controller
                name="datetime_until"
                control={control}
                render={({
                  field: { onChange, ...field },
                  fieldState: { error },
                }) => (
                  <DateTimePicker
                    {...field}
                    label="End date"
                    onChange={(e) => onChange(e)}
                    renderInput={(params) => (
                      <TextField
                        variant="outlined"
                        error={!!error}
                        helperText={error?.message}
                        //disabled={methodSelectionDisabled}
                        sx={{
                          width: "100%",
                          mt: 3, // backgroundColor: `${theme.palette.primary.light}`,
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
            </LocalizationProvider>

            {/* ///////////////////////////////////////////////////////////////////////////////// ACCESIBILITY */}
            {/* <Controller
              name="accessibility"
              control={control}
              render={({
                field: { value, onChange, ...field },
                fieldState: { error },
              }) => (
                <TextField
                  select
                  {...field}
                  label="Accessibility"
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  //disabled={methodSelectionDisabled}
                  sx={{ width: "95%", mt: 3 }}
                >
                  {(
                    Object.keys(ACTIVITY_VISIBILITY_OPTIONS) as Array<
                      keyof typeof ACTIVITY_VISIBILITY_OPTIONS
                    >
                  ).map((item: string) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            /> */}
            {/* ///////////////////////////////////////////////////////////////////////////////// MAX ATTENDANCE */}
            <Controller
              name="limit"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Maximal attendance"
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                  //disabled={methodSelectionDisabled}
                  sx={{ width: "100%", mt: 3 }}
                />
              )}
            />
            {/* ///////////////////////////////////////////////////////////////////////////////// PRICE */}
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  type="number"
                  {...field}
                  label="Price"
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                  //disabled={methodSelectionDisabled}
                  sx={{ width: "100%", mt: 3 }}
                />
              )}
            />
            <Controller
              name="visibility"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-around",
                    mt: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                    }}
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
                    mt: 3,
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
            {predefinedTags ? (
              <Controller
                name="tags"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  // <Autocomplete
                  //   multiple
                  //   aria-multiline
                  //   id="predefined-tags"
                  //   options={predefinedTags}
                  //   getOptionLabel={(option) => option.title}
                  //   // defaultValue={[top100Films[13]]}
                  //   renderInput={(params) => (
                  //     <TextField
                  //       {...params}
                  //       variant="outlined"
                  //       label="Predefined tags"
                  //       error={!!error}
                  //       helperText={error?.message}
                  //       // InputProps={{
                  //       //   style: {
                  //       //     maxHeight: "auto",
                  //       //   },
                  //       // }}
                  //       // placeholder="Predefined tags"
                  //     />
                  //   )}
                  //   sx={{ width: "100%", mt: 3, flex: 1 }}
                  // />
                  <Autocomplete
                    {...field}
                    multiple
                    id="tags-standard"
                    options={mappedTags}
                    onChange={(e, collectedTags) => {
                      field.onChange(collectedTags);
                    }}
                    // getOptionLabel={(option) => option.title}
                    defaultValue={[]}
                    sx={{
                      minWidth: "100%",
                      "& .MuiOutlinedInput-root": {
                        height: "auto",
                      },
                      mt: 2,
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // variant="outlined"
                        label="Select tags"
                        placeholder="Favorites"
                      />
                    )}
                  />
                )}
              />
            ) : null}

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
