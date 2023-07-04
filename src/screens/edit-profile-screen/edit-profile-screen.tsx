import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Badge,
  Box,
  IconButton,
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
import { getLocationFromQueryFetch } from "../../api/activities/requests";
import { updateProfileInfo } from "../../api/users/requests";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import BackHeader from "../../components/back-header";
import OffliButton from "../../components/offli-button";
import { PageWrapper } from "../../components/page-wrapper";
import { useUser } from "../../hooks/use-user";
import { ILocation } from "../../types/activities/location.dto";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { mapExternalApiOptions } from "../../utils/map-location-value.util";
import userPlaceholder from "../../assets/img/user-placeholder.svg";
import AddIcon from "@mui/icons-material/Add";
import { DrawerContext } from "../../assets/theme/drawer-provider";
import { getMatchingProperties } from "./utils/get-matching-properties.util";
import ProfilePhotoActions, {
  ProfilePhotoActionsEnum,
} from "./components/profile-photo-actions";

export interface IEditProfile {
  username?: string;
  about_me?: string;
  location?: ILocation | null;
  birthdate?: Date | null;
  instagram?: string | null;
  placeQuery?: string;
  profile_photo_url?: string | null;
}

const schema: () => yup.SchemaOf<IEditProfile> = () =>
  yup.object({
    username: yup.string().defined().required("Please enter your username"),
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
    birthdate: yup.date().nullable(true).notRequired(),
    placeQuery: yup.string().notRequired(),
    instagram: yup.string().nullable(true).notRequired(),
    profile_photo_url: yup.string().notRequired().nullable(true),
  });

const EditProfileScreen: React.FC = () => {
  const { palette } = useTheme();
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { toggleDrawer } = React.useContext(DrawerContext);

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

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { dirtyFields },
    reset,
    setValue,
  } = useForm<IEditProfile>({
    defaultValues: {
      username: "",
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
      username: data?.username ?? "",
      about_me: data?.about_me ?? "",
      birthdate: (data?.birthdate as Date) ?? null,
      location: data?.location ?? null,
      instagram: data?.instagram,
      profile_photo_url: data?.profile_photo_url,
    });
  }, [data]);

  const handleFormSubmit = React.useCallback(
    (values: IEditProfile) => {
      const updatedValues = getMatchingProperties(values, dirtyFields);
      sendUpdateProfile(updatedValues);
    },
    [dirtyFields]
  );

  const handleProfilePhotoAction = React.useCallback(
    (action?: ProfilePhotoActionsEnum) => {
      console.log(action);
    },
    []
  );

  const handlePictureClick = React.useCallback(() => {
    toggleDrawer({
      open: true,
      content: <ProfilePhotoActions onActionClick={handleProfilePhotoAction} />,
    });
  }, [toggleDrawer]);

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
          <Box sx={{ position: "relative" }} onClick={handlePictureClick}>
            <img
              src={data?.profile_photo_url ?? userPlaceholder}
              alt="profile"
              style={{
                height: "70px",
                width: "70px",
                borderRadius: "50%",
                border: `2px solid ${palette.primary.main}`,
                boxShadow: "5px 5px 20px 0px rgba(0,0,0,0.6)",
              }}
            />
            <OffliButton
              size="small"
              sx={{
                position: "absolute",
                p: 0.5,
                m: 0,
                right: 2,
                bgcolor: palette?.primary?.main,
                width: 20,
                height: 20,
                minWidth: "unset",
              }}
            >
              <AddIcon
                sx={{
                  color: "white",
                }}
              />
            </OffliButton>
          </Box>

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
            <Box sx={{ width: "90%" }}>
              <Controller
                name="username"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Typography
                      sx={{ fontWeight: "bold", color: palette?.text?.primary }}
                    >
                      Username
                    </Typography>
                    <TextField
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                      sx={{ width: "100%", my: 1.5 }}
                      data-testid="name-input"
                      // label="Name"
                    />
                  </>
                )}
              />

              <Controller
                name="about_me"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Typography
                      sx={{ fontWeight: "bold", color: palette?.text?.primary }}
                    >
                      About me
                    </Typography>
                    <TextField
                      {...field}
                      multiline
                      rows={3}
                      // label="Type something about you"
                      placeholder="Type something about you"
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
                  </>
                )}
              />

              <Controller
                name="location"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Typography
                      sx={{ fontWeight: "bold", color: palette?.text?.primary }}
                    >
                      Location
                    </Typography>
                    {/* // We have completely different approach handling location here and in place-form
                  // TODO we should map options to our ILocation object as it is here
                   */}
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
                          // label="Location"
                          onChange={(e) =>
                            setValue("placeQuery", e.target.value)
                          }
                          error={!!error}
                          helperText={!!error && "Location is required"}
                        />
                      )}
                      data-testid="activity-place-input"
                    />
                  </>
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
                    <>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: palette?.text?.primary,
                        }}
                      >
                        Birthdate
                      </Typography>
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
                            // label="Birthdate"
                          />
                        )}
                      />
                    </>
                  )}
                />
              </LocalizationProvider>
              <Controller
                name="instagram"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Typography
                      sx={{ fontWeight: "bold", color: palette?.text?.primary }}
                    >
                      Instagram
                    </Typography>
                    <TextField
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                      sx={{ width: "100%", my: 1.5 }}
                      data-testid="instagram-username-input"
                      // label="Instagram"
                    />
                  </>
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
