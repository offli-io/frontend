import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import * as yup from "yup";
import { getLocationFromQueryFetch } from "../api/activities/requests";
import { updateProfileInfo } from "../api/users/requests";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import ActionButton from "../components/action-button";
import BackHeader from "../components/back-header";
import { PageWrapper } from "../components/page-wrapper";
import { useUser } from "../hooks/use-user";
import { ILocation } from "../types/activities/location.dto";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import {
  mapExternalApiOptions,
  mapFormattedToValue,
  mapLocationValue,
} from "../utils/map-location-value.util";
import { mapPlaceValue } from "./create-activity-screen/utils/map-place-value.util";
import OffliButton from "../components/offli-button";

interface IEditProfile {
  name: string;
  about_me?: string;
  location?: ILocation | null;
  birthdate: Date | null;
  instagram: string;
  placeQuery?: string;
}

const schema: () => yup.SchemaOf<IEditProfile> = () =>
  yup.object({
    name: yup.string().defined().required("Please enter your name"),
    about_me: yup.string().notRequired(),
    location: yup
      .object({
        name: yup.string().defined().required(),
        coordinates: yup
          .object({
            lat: yup.number().defined().required(),
            lon: yup.number().defined().required(),
          })
          .defined()
          .required(),
      })
      .nullable(true),
    birthdate: yup.date().nullable().required("Please enter your birth date"),
    placeQuery: yup.string().notRequired(),
    instagram: yup
      .string()
      .defined()
      .required("Please enter your instagram username"),
  });

const EditProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: sendUpdateProfile, isLoading: isSubmitting } = useMutation(
    ["update-profile-info"],
    (values: IEditProfile) =>
      //TODO handle location through autocomplete
      updateProfileInfo(userInfo?.id, {
        ...values,
      }),
    {
      onSuccess: (data, variables) => {
        //TODO what to invalidate, and where to navigate after success
        // queryClient.invalidateQueries(['notifications'])
        // navigateBasedOnType(
        //   variables?.type,
        //   variables?.properties?.user?.id ?? variables?.properties?.activity?.id
        // )

        queryClient.invalidateQueries(["user"]);
        enqueueSnackbar("Your personal information was successfully updated", {
          variant: "success",
        });
        navigate(ApplicationLocations.PROFILE);
      },
      onError: () => {
        enqueueSnackbar("Failed to update your personal info", {
          variant: "error",
        });
      },
    }
  );

  const { data: { data = {} } = {} } = useUser({
    id: userInfo?.id,
  });

  const navigate = useNavigate();

  const { control, handleSubmit, watch, setError, formState, reset, setValue } =
    useForm<IEditProfile>({
      defaultValues: {
        name: "",
        about_me: "",
        // location: "",
        birthdate: null,
        location: null,
        instagram: "",
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

  useEffect(() => {
    // alebo setValue ak bude resetu kurovat

    reset({
      name: data?.name ?? "",
      about_me: data?.about_me ?? "",
      birthdate: (data?.birthdate as Date) ?? null,
      location: data?.location ?? null,
      instagram: data?.instagram,
    });
  }, [data]);

  const handleFormSubmit = React.useCallback((values: IEditProfile) => {
    sendUpdateProfile(values);
  }, []);

  const location = watch("location");

  return (
    <>
      <BackHeader
        title="Edit profile"
        sx={{ mb: 2 }}
        to={ApplicationLocations.PROFILE}
      />
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
            onClick={() => console.log("asas")}
            // todo add default picture in case of missing photo
            src={data?.profile_photo_url}
            alt="profile"
            style={{
              height: "70px",
              width: "70px",
              borderRadius: "50%",
              border: `3px solid ${theme.palette.primary.main}`, //nejde pica
            }}
          />
          <FormGroup sx={{ ml: 2, mt: 1 }}>
            <FormControlLabel control={<Checkbox />} label="Use default" />
          </FormGroup>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
            onSubmit={handleSubmit(handleFormSubmit, (data, e) =>
              console.log(data, e)
            )}
            data-testid="edit-profile-form"
          >
            <Box sx={{ mx: 2 }}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                    sx={{ width: "100%", my: 1.5 }}
                    data-testid="name-input"
                    label="Name"
                  />
                )}
              />

              <Controller
                name="about_me"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    multiline
                    rows={3}
                    label="Additional description"
                    placeholder="Type more info about the activity"
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        height: "unset",
                      },
                      my: 1.5,
                    }}
                    helperText={`${field?.value?.length ?? 0}/200`}
                    inputProps={{ maxLength: 200 }}
                    data-testid="about-me-input"
                  />
                )}
              />

              <Controller
                name="location"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  // We have completely different approach handling location here and in place-form
                  // TODO we should map options to our ILocation object as it is here
                  <Autocomplete
                    {...field}
                    options={mapExternalApiOptions(placeQuery?.data?.results)}
                    value={field?.value}
                    // isOptionEqualToValue={(option, value) =>
                    //   option?.formatted === (value?.formatted ?? value?.name)
                    // }
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContentw: "center",
                      my: 1.5,
                    }}
                    loading={placeQuery?.isLoading}
                    onChange={(e, locationObject) => {
                      console.log(e, locationObject);
                      field.onChange({
                        name: locationObject?.name ?? "",
                        coordinates: locationObject?.coordinates,
                      });
                    }}
                    inputValue={field?.value?.name}
                    getOptionLabel={(option) => String(option?.name)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Location"
                        onChange={(e) => setValue("placeQuery", e.target.value)}
                        error={!!error}
                        helperText={!!error && "Location is required"}
                      />
                    )}
                    data-testid="activity-place-input"
                  />
                )}
              />

              {/* TODO outsource this on the Contexes and Adapters level in the App */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="birthdate"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <DatePicker
                      openTo="year"
                      inputFormat="DD/MM/YYYY"
                      value={value}
                      disableFuture
                      // closeOnSelect
                      onChange={onChange}
                      maxDate={new Date()}
                      data-testid="birthdate-date-picker"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{ width: "100%", my: 1.5 }}
                          error={!!error}
                          helperText={error?.message}
                          label="Birthdate"
                        />
                      )}
                    />
                  )}
                />
              </LocalizationProvider>
              <Controller
                name="instagram"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                    sx={{ width: "100%", my: 1.5 }}
                    data-testid="instagram-username-input"
                    label="Instagram"
                  />
                )}
              />
            </Box>
            <OffliButton
              type="submit"
              sx={{ mt: 3, mb: 2, width: "50%" }}
              isLoading={isSubmitting}
              data-testid="submit-btn"
            >
              Save
            </OffliButton>
          </form>
        </Box>
      </PageWrapper>
    </>
  );
};

export default EditProfileScreen;
