import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import OffliButton from "../components/offli-button";
import GoogleIcon from "@mui/icons-material/Google";

import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import LabeledDivider from "../components/labeled-divider";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { checkIfEmailAlreadyTaken, preCreateUser } from "../api/users/requests";

import { ApplicationLocations } from "../types/common/applications-locations.dto";
import { IEmailPassword } from "../types/users/user.dto";
import { CLIENT_ID } from "../utils/common-constants";
import { getBearerToken, registerViaGoogle } from "../api/auth/requests";
import { useSnackbar } from "notistack";
import { getGoogleUrl } from "../utils/token.util";
import OffliBackButton from "../components/offli-back-button";
import { AuthenticationContext } from "../assets/theme/authentication-provider";

const schema: () => yup.SchemaOf<IEmailPassword> = () =>
  yup.object({
    email: yup
      .string()
      .email("Email must be a valid email")
      .defined()
      .required("Please enter your email"),
    password: yup
      .string()
      .defined()
      .required("Please enter your password")
      .min(8, "Password must be at least 8 characters long")
      .max(16, "Password must be less than 16 characters long")
      .matches(/^(?=.*[A-Z])/, "Password must contain at least one uppercase")
      .matches(/^(?=.*[0-9])/, "Password must contain at least one number"),
  });

export const RegistrationScreen: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState<string | undefined>();
  const queryParameters = new URLSearchParams(window.location.search);
  const authorizationCode = queryParameters.get("code");
  const { enqueueSnackbar } = useSnackbar();
  const { setUserInfo, setStateToken } = React.useContext(
    AuthenticationContext
  );

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: emailAlreadyTaken, isLoading } = useQuery<any>(
    ["email-taken", email],
    () => checkIfEmailAlreadyTaken(email),
    {
      enabled: !!email,
    }
  );

  const { mutate: sendGetBearerToken } = useMutation(
    ["google-registration"],
    (authorizationCode?: string) =>
      getBearerToken(authorizationCode, "register"),
    {
      onSuccess: (data, params) => {
        data?.data?.access_token &&
          sendRegisterViaGoogle(data?.data?.access_token);
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

  const { mutate: sendRegisterViaGoogle } = useMutation(
    ["google-registration"],
    (authorizationCode?: string) => registerViaGoogle(authorizationCode),
    {
      onSuccess: (data, params) => {
        enqueueSnackbar("You account has been successfully registered", {
          variant: "success",
        });
        setStateToken(data?.data?.token?.access_token ?? null);
        !!setUserInfo && setUserInfo({ id: data?.data?.user_id });
        data?.data?.user_id &&
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

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { control, handleSubmit, watch, setError, formState } =
    useForm<IEmailPassword>({
      defaultValues: {
        email: "",
        password: "",
      },
      resolver: yupResolver(schema()),
      mode: "onChange",
    });

  // console.log(formState?.errors)

  React.useEffect(() => {
    if (authorizationCode) {
      sendGetBearerToken(authorizationCode);
    }
  }, [authorizationCode]);

  const isEmailInUse = Object.keys(formState?.errors)?.length !== 0;

  const handleFormSubmit = React.useCallback((values: IEmailPassword) => {
    queryClient.setQueryData(["registration-email-password"], values);
    navigate(ApplicationLocations.PICK_USERNAME);
    // console.log(data?.data)
  }, []);

  React.useEffect(() => {
    if (emailAlreadyTaken?.data) {
      setError("email", { message: "Email already in use" });
    }
  }, [emailAlreadyTaken]);

  return (
    <>
      <OffliBackButton
        onClick={() => navigate(ApplicationLocations.LOGIN)}
        sx={{ alignSelf: "flex-start", m: 1 }}
      >
        Sign in
      </OffliBackButton>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box
          sx={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            //   justifyContent: 'center',
          }}
        >
          <Typography
            variant="h1"
            gutterBottom
            sx={{
              my: 5,
              display: "flex",
            }}
          >
            Your offline life.
          </Typography>
          {/* <Box
          sx={{
            mb: 1,
          }}
          id="signIn"
        ></Box> */}
          <OffliButton
            startIcon={<GoogleIcon />}
            onClick={() => {
              window.location.href = getGoogleUrl("register");
            }}
            sx={{ mb: 1 }}
          >
            Sign up with Google
          </OffliButton>

          <LabeledDivider sx={{ my: 1 }}>
            <Typography variant="subtitle1">or</Typography>
          </LabeledDivider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              mb: 7,
            }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  //   label="Username"
                  placeholder="Email"
                  error={!!error}
                  helperText={error?.message}
                  //disabled={methodSelectionDisabled}
                  sx={{ width: "80%", mb: 2 }}
                  onBlur={(event) => setEmail(event.target.value)}
                  // InputProps={{
                  //   endAdornment: (
                  //     <InputAdornment position="end">
                  //       <IconButton>
                  //         {renderEmailIcon()}
                  //         {/* {emailValidity ? (
                  //           <CheckCircleIcon sx={{ color: 'green' }} />
                  //         ) : (
                  //           <RemoveCircleIcon sx={{ color: 'red' }} />
                  //         )} */}
                  //       </IconButton>
                  //     </InputAdornment>
                  //   ),
                  // }}
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
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  // variant="filled"
                  error={!!error}
                  helperText={error?.message}
                  //disabled={methodSelectionDisabled}
                  sx={{ width: "80%" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? (
                            <VisibilityIcon sx={{ color: "lightgrey" }} />
                          ) : (
                            <VisibilityOffIcon sx={{ color: "lightgrey" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Typography
              variant="subtitle1"
              align="center"
              sx={{
                color: "lightgrey",
                mt: 2,
                lineHeight: 1.2,
              }}
            >
              By signing up, you agree to the terms of the <br />
              Offli <b>Privacy Policy</b> and <b>Cookie Policy</b>.
            </Typography>
          </Box>

          <OffliButton
            type="submit"
            sx={{ width: "70%", mb: 5 }}
            disabled={!formState?.isValid || isEmailInUse || isLoading}
          >
            Register
          </OffliButton>
        </Box>
      </form>
    </>
  );
};

export default RegistrationScreen;
