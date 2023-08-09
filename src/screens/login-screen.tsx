import GoogleIcon from "@mui/icons-material/Google";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { loginUser, loginViaGoogle } from "../api/auth/requests";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import LabeledDivider from "../components/labeled-divider";
import Logo from "../components/logo";
import OffliBackButton from "../components/offli-back-button";
import OffliButton from "../components/offli-button";
import { useGoogleAuthorization } from "../hooks/use-google-authorization";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import { GoogleAuthCodeFromEnumDto } from "../types/google/google-auth-code-from-enum.dto";

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
  const {
    googleToken,
    handleGoogleAuthorization,
    isLoading: isGoogleAuthorizationLoading,
  } = useGoogleAuthorization({
    from: GoogleAuthCodeFromEnumDto.LOGIN,
  });
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { control, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  const { isLoading: isGoogleLoginLoading, mutate: sendLoginViaGoogle } =
    useMutation(
      ["google-login"],
      (authorizationCode?: string) => {
        abortControllerRef.current = new AbortController();
        return loginViaGoogle(
          authorizationCode,
          abortControllerRef?.current?.signal
        );
      },
      {
        onSuccess: (data, params) => {
          setStateToken(data?.data?.token?.access_token ?? null);
          !!setUserInfo &&
            setUserInfo({
              id: data?.data?.user_id,
            });
          localStorage.setItem("userId", String(data?.data?.user_id));
          navigate(ApplicationLocations.ACTIVITIES);
        },
        onError: (error) => {
          enqueueSnackbar("Login with google failed", {
            variant: "error",
          });
        },
      }
    );
  const { isLoading, mutate: sendLogin } = useMutation(
    ["login"],
    (formValues: FormValues) => {
      return loginUser(formValues);
    },
    {
      onSuccess: (data, params) => {
        console.log(data?.data);
        // setAuthToken(data?.data?.access_token)
        // setRefreshToken(data?.data?.refresh_token)
        //TODO refresh user Id after refresh
        setStateToken(data?.data?.token?.access_token ?? null);
        setUserInfo?.({ username: params?.username, id: data?.data?.user_id });
        localStorage.setItem("userId", String(data?.data?.user_id));
        navigate(ApplicationLocations.ACTIVITIES);
      },
      onError: (error) => {
        enqueueSnackbar("Failed to log in", { variant: "error" });
      },
    }
  );

  const handleFormSubmit = React.useCallback(
    (values: FormValues) => sendLogin(values),
    [sendLogin]
  );

  React.useEffect(() => {
    if (googleToken) {
      sendLoginViaGoogle(googleToken);
    }
  }, [googleToken]);

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
            onClick={handleGoogleAuthorization}
            sx={{ mb: 1 }}
            disabled={isLoading || isGoogleAuthorizationLoading}
          >
            Sign in with Google
          </OffliButton>

          <LabeledDivider sx={{ my: 1 }}>
            <Typography variant="subtitle1">or</Typography>
          </LabeledDivider>
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                data-testid="username-input"
                label="Email or username"
                error={!!error}
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
                data-testid="password-input"
                label="Password"
                type={showPassword ? "text" : "password"}
                error={!!error}
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
            data-testid="forgot-password-btn"
          >
            Forgot your password?
          </OffliButton>
        </Box>
        <OffliButton
          data-testid="submit-btn"
          sx={{ width: "80%", mb: 5 }}
          type="submit"
          isLoading={isLoading || isGoogleAuthorizationLoading}
          disabled={!formState?.isValid}
        >
          Login
        </OffliButton>
      </form>
    </>
  );
};

export default LoginScreen;
