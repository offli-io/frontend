import React from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import qs from "qs";
import GoogleIcon from "@mui/icons-material/Google";

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
  getGoogleUrl,
  setAuthToken,
  setRefreshToken,
} from "../utils/token.util";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import { useNavigate } from "react-router-dom";
import { DEFAULT_KEYCLOAK_URL } from "../assets/config";
import {
  getBearerToken,
  loginUser,
  loginViaGoogle,
} from "../api/auth/requests";
import OffliBackButton from "../components/offli-back-button";

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

  let BASE_URL = (window as any)?.appConfig?.ANALYTICS_URL;

  const [config, setConfig] = React.useState<any>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const queryParameters = new URLSearchParams(window.location.search);
  const authorizationCode = queryParameters.get("code");

  console.log(process.env.REACT_APP_API_URL);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { control, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  const { mutate: sendGetBearerToken } = useMutation(
    ["google-registration"],
    (authorizationCode?: string) => getBearerToken(authorizationCode, "login"),
    {
      onSuccess: (data, params) => {
        data?.data?.access_token &&
          sendLoginViaGoogle(data?.data?.access_token);
        // setStateToken(data?.data?.token?.access_token ?? null);
        // !!setUserInfo && setUserInfo({ id: data?.data?.user_id });
        // data?.data?.user_id &&
        //   localStorage.setItem("userId", data?.data?.user_id);
        // navigate(ApplicationLocations.ACTIVITIES);
      },
      onError: (error) => {
        // enqueueSnackbar("Registration with google failed", {
        //   variant: "error",
        // });
        //TODO debug why there are 2 requests
      },
    }
  );

  const { isLoading: isGoogleLoginLoading, mutate: sendLoginViaGoogle } =
    useMutation(
      ["google-login"],
      (authorizationCode?: string) => loginViaGoogle(authorizationCode),
      {
        onSuccess: (data, params) => {
          setStateToken(data?.data?.token?.access_token ?? null);
          !!setUserInfo &&
            setUserInfo({
              id: data?.data?.user_id,
            });
          localStorage.setItem("userId", data?.data?.user_id);
          navigate(ApplicationLocations.ACTIVITIES);
        },
        onError: (error) => {
          enqueueSnackbar("Registration with google failed", {
            variant: "error",
          });
        },
      }
    );
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
        //TODO refresh user Id after refresh
        setStateToken(data?.data?.token?.access_token ?? null);
        !!setUserInfo &&
          setUserInfo({ username: params?.username, id: data?.data?.user_id });
        localStorage.setItem("userId", data?.data?.user_id);
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

  React.useEffect(() => {
    if (authorizationCode) {
      sendGetBearerToken(authorizationCode);
    }
  }, [authorizationCode]);

  return (
    <>
      <OffliBackButton
        onClick={() => navigate(ApplicationLocations.REGISTER)}
        sx={{ alignSelf: "flex-start", m: 1 }}
      >
        Sign up
      </OffliBackButton>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // justifyContent: "space-between",
        }}
      >
        <Logo sx={{ mb: 5, mt: 2 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
          }}
        >
          <OffliButton
            startIcon={<GoogleIcon />}
            onClick={() => {
              window.location.href = getGoogleUrl("login");
            }}
            sx={{ mb: 1 }}
          >
            Sign in with Google
          </OffliButton>

          <LabeledDivider sx={{ my: 1 }}>
            <Typography variant="subtitle1">or</Typography>
          </LabeledDivider>
          {/* <Typography>{process.env.REACT_APP_API_URL ?? "nevyplnena"}</Typography> */}
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
            sx={{ fontSize: 14, mt: 1, mb: 7 }}
            onClick={() => navigate(ApplicationLocations.FORGOTTEN_PASSWORD)}
          >
            Forgot your password?
          </OffliButton>
        </Box>
        <OffliButton
          sx={{ width: "80%", mb: 5 }}
          type="submit"
          isLoading={isLoading}
          disabled={!formState?.isValid}
        >
          Login
        </OffliButton>
      </form>
    </>
  );
};

export default LoginScreen;
