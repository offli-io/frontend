import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Grid,
  Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useTheme,
} from "@mui/material";
import { PageWrapper } from "../components/page-wrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BackHeader from "../components/back-header";
import { IPersonExtended } from "../types/activities/activity.dto";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import ActionButton from "../components/action-button";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import moment from "moment";
import { useUsers } from "../hooks/use-users";
import { updateProfileInfo } from "../api/users/requests";
import { useSnackbar } from "notistack";

interface IEditProfile {
  name: string;
  about_me: string;
  location: string;
  birthdate: Date | null;
  instagram: string;
}

const schema: () => yup.SchemaOf<IEditProfile> = () =>
  yup.object({
    name: yup.string().defined().required("Please enter your name"),
    about_me: yup.string().defined().required("Please enter your aboutMe"),
    location: yup.string().defined().required("Please enter your location"),
    birthdate: yup.date().nullable().required("Please enter your birthDate"),
    instagram: yup
      .string()
      .defined()
      .required("Please enter your instagramUsername"),
  });

const EditProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  // const data = queryClient.getQueryData<{ data: IPersonExtended }>([
  //   "user-info",
  //   userInfo?.username,
  // ]);

  const { mutate: sendUpdateProfile } = useMutation(
    ["update-profile-info"],
    (values: IEditProfile) => updateProfileInfo(userInfo?.id, values),
    {
      onSuccess: (data, variables) => {
        //TODO what to invalidate, and where to navigate after success
        // queryClient.invalidateQueries(['notifications'])
        // navigateBasedOnType(
        //   variables?.type,
        //   variables?.properties?.user?.id ?? variables?.properties?.activity?.id
        // )
        queryClient.invalidateQueries(["users"]);
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

  const { data: { data = {} } = {} } = useUsers({ id: userInfo?.id });

  const navigate = useNavigate();

  const { control, handleSubmit, watch, setError, formState, reset } =
    useForm<IEditProfile>({
      defaultValues: {
        name: "",
        about_me: "",
        // location: "",
        birthdate: null,
        instagram: "",
      },
      resolver: yupResolver(schema()),
      mode: "onChange",
    });

  useEffect(() => {
    // alebo setValue ak bude resetu kurovat

    reset({
      name: data?.name,
      // aboutMe: data?.data?.name, // TODO: doplnit udaje na BE a pripojit FE
      about_me: data?.about_me ?? "",
      // location: data?.location ?? "",
      // fix this mby later
      birthdate: (data?.birthdate as Date) ?? null,
      // birthDate: '',
      instagram: "staryjanotvojtatko",
    });
  }, [data]);

  // console.log(formState?.errors)

  const handleFormSubmit = React.useCallback((values: IEditProfile) => {
    //OnSuccess
    // queryClient.invalidateQueries(['user-info'])
    // navigate(ApplicationLocations.PROFILE)
    sendUpdateProfile(values);
  }, []);

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
              // border: '2px solid black',
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
          >
            <Grid
              container
              rowSpacing={1.5}
              sx={{ width: "80%", mt: 1, fontSize: 5, alignItems: "center" }}
            >
              <Grid item xs={5}>
                <Typography variant="h5">Name</Typography>
              </Grid>
              <Grid item xs={7}>
                {/* <Typography variant="h6">{data?.data?.name}</Typography> */}
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      variant="standard"
                      error={!!error}
                      helperText={error?.message}
                      //disabled={methodSelectionDisabled}
                      sx={{ width: "100%" }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5} sx={{ mt: 1 }}>
                <Typography variant="h5">About me</Typography>
              </Grid>
              <Grid item xs={7} sx={{ mt: 1 }}>
                <Controller
                  name="about_me"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      multiline
                      maxRows={4}
                      variant="standard"
                      error={!!error}
                      helperText={error?.message}
                      //disabled={methodSelectionDisabled}
                      sx={{ width: "100%" }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5} sx={{ mt: 1 }}>
                <Typography variant="h5">Location</Typography>
              </Grid>
              <Grid item xs={7} sx={{ mt: 1 }}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      variant="standard"
                      error={!!error}
                      helperText={error?.message}
                      //disabled={methodSelectionDisabled}
                      sx={{ width: "100%" }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h5">Birthdate</Typography>
              </Grid>
              <Grid item xs={7}>
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
                        renderInput={(params) => (
                          <TextField
                            variant="standard"
                            {...params}
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    )}
                  />
                </LocalizationProvider>
                {/* <Controller
                  name="birthDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      autoFocus
                      {...field}
                      variant="standard"
                      error={!!error}
                      helperText={error?.message}
                      //disabled={methodSelectionDisabled}
                      sx={{ width: '100%' }}
                    />
                  )}
                /> */}
              </Grid>
              <Grid item xs={5} sx={{ mt: 1 }}>
                <Typography variant="h5">Instagram Username</Typography>
              </Grid>
              <Grid item xs={7} sx={{ mt: 1 }}>
                <Controller
                  name="instagram"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      variant="standard"
                      error={!!error}
                      helperText={error?.message}
                      sx={{ width: "100%" }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <ActionButton type="submit" text="Save" sx={{ mt: 5 }} />
          </form>
          {/* <Button
          style={{
            width: '60%',
            borderRadius: '15px',
            backgroundColor: '#E4E3FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2%',
            marginTop: '12%',
          }}
          onClick={saveChanges}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
            }}
          >
            Save
          </Typography>
        </Button> */}
        </Box>
      </PageWrapper>
    </>
  );
};

export default EditProfileScreen;
