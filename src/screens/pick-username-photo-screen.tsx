import React from "react";
import { Box, Typography, TextField, IconButton, Icon } from "@mui/material";
import BackButton from "../components/back-button";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import OffliButton from "../components/offli-button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import {
  IEmailPassword,
  IEmailUsernamePassword,
  IUsername,
} from "../types/users/user.dto";
import {
  checkIfUsernameAlreadyTaken,
  preCreateUser,
} from "../api/users/requests";
import OffliBackButton from "../components/offli-back-button";
import { useSnackbar } from "notistack";

const schema: () => yup.SchemaOf<IUsername> = () =>
  yup.object({
    username: yup.string().defined().required("Please enter your username"),
  });

const PickUsernamePhotoScreen = () => {
  const [username, setUsername] = React.useState<string>("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit, setError, formState } = useForm<IUsername>({
    defaultValues: {
      username: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  const queryClient = useQueryClient();

  const { data: usernameAlreadyTaken } = useQuery<any>(
    ["username-taken", username],
    () => checkIfUsernameAlreadyTaken(username),
    {
      enabled: !!username,
    }
  );

  const isUsernameInUse = Object.keys(formState?.errors)?.length !== 0;

  const { mutate: sendPresignupUser, isLoading } = useMutation(
    ["pre-created-user"],
    (values: IEmailUsernamePassword) => preCreateUser(values),
    {
      onSuccess: (data) => {
        console.log(data);
        navigate(ApplicationLocations.VERIFY);
      },
      onError: (error) => {
        console.log(error);
        enqueueSnackbar("Failed to pre-signup", { variant: "error" });
      },
    }
  );

  const handleFormSubmit = React.useCallback((values: IUsername) => {
    // if (usernameAlreadyTaken?.data) {
    //   setError('username', { message: 'Username already in use' })
    //   console.log(usernameAlreadyTaken?.data)
    //   return
    // }
    queryClient.setQueryData(["registration-username"], values);

    const registrationEmailPassword = queryClient.getQueryData<IEmailPassword>([
      "registration-email-password",
    ]);

    // navigate(ApplicationLocations.VERIFY);

    sendPresignupUser({
      email: registrationEmailPassword?.email,
      username: values?.username,
      password: registrationEmailPassword?.password,
    });
  }, []);

  React.useEffect(() => {
    if (usernameAlreadyTaken?.data) {
      setError("username", { message: "Username already in use" });
    }
  }, [usernameAlreadyTaken]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ height: "100%" }}>
      <OffliBackButton
        onClick={() => navigate(ApplicationLocations.REGISTER)}
        sx={{ alignSelf: "flex-start", m: 1 }}
      >
        Registration
      </OffliBackButton>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // justifyContent: "center",
        }}
      >
        <Typography variant="h2" align="left" sx={{ width: "75%", mt: 15 }}>
          <Box sx={{ color: "primary.main", width: "85%" }}>Choose&nbsp;</Box>
          your username
        </Typography>
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              autoFocus
              {...field}
              //label="Username"
              placeholder="Username"
              error={!!error}
              helperText={error?.message}
              onBlur={(event) => {
                setUsername(event.target.value);
              }}
              sx={{ width: "80%", mt: 4, mb: 8 }}
            />
          )}
        />
        <OffliButton
          variant="contained"
          type="submit"
          sx={{ width: "80%", mb: 5 }}
          disabled={isLoading}
        >
          Next
        </OffliButton>
      </Box>
    </form>
  );
};

export default PickUsernamePhotoScreen;
