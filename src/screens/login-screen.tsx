import React from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import qs from "qs";
import Logo from "../components/logo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import OffliButton from "../components/offli-button";
import LabeledDivider from "../components/labeled-divider";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  getAuthToken,
  setAuthToken,
  setRefreshToken,
} from "../utils/token.util";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import { useNavigate } from "react-router-dom";
import { DEFAULT_KEYCLOAK_URL } from "../assets/config";
import { loginUser } from "../api/auth/requests";

export interface FormValues {
  username: string;
  password: string;
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    username: yup.string().defined().required(),
    password: yup.string().defined().required(),
  });

const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { setUserInfo, setStateToken } = React.useContext(
    AuthenticationContext
  );
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  const { isLoading, mutate } = useMutation(
    ["login"],
    (formValues: FormValues) => {
      //keycloak login that we are using no more
      // const data = {
      //   ...formValues,
      //   grant_type: 'password',
      //   client_id: 'UserManagement',
      // }
      // const options = {
      //   method: 'POST',
      //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
      //   data: qs.stringify(data),
      //   url: `${DEFAULT_KEYCLOAK_URL}/realms/Offli/protocol/openid-connect/token`,
      // }
      return loginUser(formValues);
    },
    {
      onSuccess: (data, params) => {
        console.log(data?.data);
        // setAuthToken(data?.data?.access_token)
        // setRefreshToken(data?.data?.refresh_token)
        setStateToken(data?.data?.token?.access_token ?? null);
        !!setUserInfo && setUserInfo({ username: params?.username });
        localStorage.setItem("username", params?.username);
        navigate(ApplicationLocations.ACTIVITIES);
      },
      onError: (error) => {
        enqueueSnackbar("Failed to log in", { variant: "error" });
      },
    }
  );

  const handleFormSubmit = React.useCallback(
    (values: FormValues) => mutate(values),
    [mutate]
  );

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
      // className="backgroundImage"
    >
      <Logo />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Box id="signIn"></Box>
        {/* <button id="authorize-button">Authorize</button> */}

        <LabeledDivider sx={{ my: 1 }}>
          <Typography variant="subtitle1">or</Typography>
        </LabeledDivider>
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              //label="Username"
              label="Email or username"
              // variant="filled"
              error={!!error}
              // helperText={
              //   error?.message ||
              //   t(`value.${nextStep?.authenticationType}.placeholder`)
              // }
              // disabled={methodSelectionDisabled}
              sx={{ width: "80%", mb: 2 }}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              //label="Username"
              label="Password"
              type={showPassword ? "text" : "password"}
              // variant="filled"
              error={!!error}
              // helperText={
              //   error?.message ||
              //   t(`value.${nextStep?.authenticationType}.placeholder`)
              // }
              //disabled={methodSelectionDisabled}
              sx={{ width: "80%" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <OffliButton
          variant="text"
          disabled={isLoading}
          sx={{ fontSize: 14, mt: 1 }}
        >
          Forgot your password?
        </OffliButton>
      </Box>
      <OffliButton
        sx={{ width: "80%", mb: 5 }}
        type="submit"
        isLoading={isLoading}
      >
        Login
      </OffliButton>
    </form>
  );
};

export default LoginScreen;
