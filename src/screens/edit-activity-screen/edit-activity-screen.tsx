import {
  Box,
  Typography,
  TextField,
  useTheme,
  FormControlLabel,
  MenuItem,
  Chip,
  Autocomplete,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackHeader from "../../components/back-header";
import { ICustomizedLocationStateDto } from "../../types/common/customized-location-state.dto";
import { Controller, useForm } from "react-hook-form";
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
import {
  getLocationFromQuery,
  updateActivityInfo,
} from "../../api/activities/requests";
import { IUpdateActivityRequestDto } from "../../types/activities/update-activity-request.dto";
import { ILocation } from "../../types/activities/location.dto";
import { useDebounce } from "use-debounce";
import { ActivityPriceOptionsEnum } from "../../types/common/types";
import { editActivitySchema } from "./utils/validation-schema";

export interface FormValues {
  title?: string;
  location?: ILocation;
  datetime_from?: Date;
  datetime_until?: Date;
  visibility?: ActivityVisibilityEnum | string;
  limit?: number;
  price?: ActivityPriceOptionsEnum | string;
  description?: string;
  placeQuery?: string;
}

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

  const from = (location?.state as ICustomizedLocationStateDto)?.from;
  const lodash = require("lodash"); // to create array within given range easily

  const [categoryTags, setCategoryTags] = useState<ICategoryTag[]>([]); /// TODO dat prec | null
  // const [activeCategoryTags, setActiveCategoryTags] = useState<string[]>([]);

  const { data: predefinedTags } = useTags();
  const { data: { data = {} } = {} }: any = useActivities({ id });

  // console.log(data);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { dirtyFields = [], isValid },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      // datetime_from: new Date(), // TODO: pridava 2 hodiny kvoli timezone
      // datetime_until: new Date(), // TODO: pridava 2 hodiny kvoli timezone
      visibility: ActivityVisibilityEnum.public,
      limit: MAX_ACTIVITY_ATTENDANCE,
      price: ActivityPriceOptionsEnum.free,
      description: "",
    },
    resolver: yupResolver(editActivitySchema()),
    mode: "onChange",
  });

  // filter backend results based on query string
  const [queryString] = useDebounce(watch("placeQuery"), 1000);

  const placeQuery = useQuery(
    ["locations", queryString],
    (props) => getLocationFromQuery(queryString!!),
    {
      enabled: !!queryString,
    }
  );

  useEffect(() => {
    // if predefinedTag is included in activity tags, set tag`s active param to true and vice versa

    let tagsTmp: ICategoryTag[] = [];
    // let activeTagsTmp: string[] = [];
    if (predefinedTags?.data?.tags && predefinedTags?.data?.tags?.length > 0) {
      if (data?.activity?.tags && data?.activity?.tags?.length > 0) {
        predefinedTags?.data?.tags.map((tag) => {
          if (data?.activity?.tags?.includes(tag?.title)) {
            tagsTmp.push({ title: tag?.title, active: true });
            // activeTagsTmp.push(tag?.title);
          }
          if (!data?.activity?.tags?.includes(tag?.title)) {
            tagsTmp.push({ title: tag?.title, active: false });
          } else {
            return;
          }
        });
        setCategoryTags(tagsTmp);
        // setActiveCategoryTags(activeTagsTmp);
      }
    }
  }, [predefinedTags, data]);

  const handleChipClick = (index: number, title: string) => {
    if (categoryTags) {
      var newTagsArr = [...categoryTags];

      newTagsArr[index].active = !newTagsArr[index].active;
      setCategoryTags(newTagsArr);
    }

    // mozno staci len na handleSubmit dat .filter(kde sa (ne)rovna active)
    // if (activeCategoryTags) {
    //   var newActiveTagsArr = [...activeCategoryTags];
    //   if (activeCategoryTags.includes(title)) {
    //     newActiveTagsArr = activeCategoryTags.filter(function (e) {
    //       return e !== title;
    //     });
    //   }
    //   if (!activeCategoryTags.includes(title)) {
    //     newActiveTagsArr.push(title);
    //   }
    //   setActiveCategoryTags(newActiveTagsArr);
    // }
  };

  useEffect(() => {
    const recievedStartDateTime = new Date(data?.activity?.datetime_from);
    const recievedEndDateTime = new Date(data?.activity?.datetime_until);

    reset({
      title: data?.activity?.title,
      location: {
        coordinates: {
          lat: data?.activity?.location?.coordinates?.lat,
          lon: data?.activity?.location?.coordinates?.lon,
        },
        name: data?.activity?.location?.name,
      },
      datetime_from: recievedStartDateTime,
      datetime_until: recievedEndDateTime,
      visibility: data?.activity?.visibility,
      limit: data?.activity?.limit,
      price: data?.activity?.price,
      description: data?.activity?.description,
    });
    console.log(data);
  }, [data]);

  const { mutate: sendUpdateActivity } = useMutation(
    ["update-profile-info"],
    (values: IUpdateActivityRequestDto) => updateActivityInfo(id, values),
    {
      onSuccess: (data, variables) => {
        // queryClient.invalidateQueries(["users"]);
        enqueueSnackbar("Activity information was successfully updated", {
          variant: "success",
        });
        // navigate(ApplicationLocations.ACTIVITIES);
      },
      onError: () => {
        enqueueSnackbar("Failed to update activity info", {
          variant: "error",
        });
      },
    }
  );

  const handleFormSubmit = React.useCallback(
    (values: FormValues) => {
      // console.log(values);
      let valuesToPatch: IUpdateActivityRequestDto = {};
      var activeTagsArr = categoryTags
        ?.filter(function (tag) {
          return tag.active === true;
        })
        .map((tag) => {
          return tag.title;
        });

      const tmpUpdateObj: IUpdateActivityRequestDto = {
        title: values.title,
        location: {
          coordinates: {
            lat: values?.location?.coordinates?.lat,
            lon: values?.location?.coordinates?.lon,
          },
          name: values?.location?.name,
        },
        datetime_from: values?.datetime_from?.toISOString(),
        datetime_until: values?.datetime_until?.toISOString(),
        visibility: values?.visibility,
        limit: values?.limit,
        price: values?.price,
        description: values?.description,
        tags: activeTagsArr,
      };

      // NOT including tags
      Object.keys(dirtyFields).map((field) => {
        valuesToPatch = {
          ...valuesToPatch,
          [field]: (tmpUpdateObj as any)?.[field],
        };
      });

      // include tags in valuesToPatch, if user touched them
      if (!lodash.isEqual(activeTagsArr, data?.activity?.tags)) {
        console.log("tags changed");
        valuesToPatch = { ...valuesToPatch, tags: activeTagsArr };
      }

      console.log("values to patch:", valuesToPatch);

      // sendUpdateActivity(valuesToPatch);
    },
    [dirtyFields]
  );

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
              render={({
                field: { value, ...field },
                fieldState: { error },
              }) => (
                <Autocomplete
                  options={placeQuery?.data?.data ?? []}
                  // value={placeQuery?.data?.data?.find((option) => option.display_name === value)} // TODO show current location name in Textfield
                  sx={{
                    width: "95%",
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                  }}
                  loading={placeQuery?.isLoading}
                  // isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(e, locationObject) =>
                    field.onChange({
                      name: locationObject?.display_name,
                      coordinates: {
                        lat: locationObject?.lat,
                        lon: locationObject?.lon,
                      },
                    })
                  }
                  getOptionLabel={(option) => option?.display_name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search place"
                      value={placeQuery?.data?.data?.find(
                        (option) => option.display_name === value
                      )}
                      onChange={(e) => setValue("placeQuery", e.target.value)}
                      // error={!!error}
                      // helperText={error?.message}
                    />
                  )}
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
                    name="datetime_from"
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
                    name="datetime_until"
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
                name="visibility"
                control={control}
                render={({
                  field: { value, onChange, ...field },
                  fieldState: { error },
                }) => (
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        onChange={(e) => onChange(e.target.checked)} // TODO: prerobit na enum, nefunguje
                        checked={
                          value === ActivityVisibilityEnum.public ? false : true
                        }
                        sx={{ ml: 1, mr: 1.7 }}
                      />
                    }
                    labelPlacement="start"
                    label={
                      value === ActivityVisibilityEnum.public
                        ? "public"
                        : "private"
                    }
                  ></FormControlLabel>
                )}
              />
            </Box>
            {/* ///////////////////////////////////////////////////////////////////////////////// MAX ATTENDANCE */}
            <Controller
              name="limit"
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
                  {Object.values(ActivityPriceOptionsEnum).map(
                    (value: string) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    )
                  )}
                </TextField>
              )}
            />
            {/* ///////////////////////////////////////////////////////////////////////////////// ADDITIONAL DESC */}
            <Controller
              name="description"
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
