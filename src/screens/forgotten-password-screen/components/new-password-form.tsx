import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import OffliButton from "../../../components/offli-button";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { confirmResetPassword } from "../../../api/auth/requests";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

export interface FormValues {
  password: string;
  repeated_password: string;
}

interface INewPasswordFormProps {
  onSuccess: () => void;
  email: string;
  verificationCode: string;
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    password: yup
      .string()
      .defined()
      .required("Please enter your password")
      .min(8, "Password must be at least 8 characters long")
      .max(16, "Password must be less than 16 characters long")
      .matches(/^(?=.*[A-Z])/, "Password must contain at least one uppercase")
      .matches(/^(?=.*[0-9])/, "Password must contain at least one number"),
    repeated_password: yup
      .string()
      .defined()
      .required("Please enter your password")
      .min(8, "Password must be at least 8 characters long")
      .max(16, "Password must be less than 16 characters long")
      .matches(/^(?=.*[A-Z])/, "Password must contain at least one uppercase")
      .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

const NewPasswordForm: React.FC<INewPasswordFormProps> = ({
  onSuccess,
  email,
  verificationCode,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      password: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  const { isLoading, mutate: sendConfirmResetPassword } = useMutation(
    ["confirm-reset-password"],
    (values: FormValues) => {
      return confirmResetPassword({
        password: values?.password,
        verification_code: verificationCode,
        email,
      });
    },
    {
      onSuccess: (data, code) => {
        enqueueSnackbar("Your password was successfully reset");
        onSuccess();
      },
      onError: (error) => {
        enqueueSnackbar("Failed to reset your password", {
          variant: "error",
        });
      },
    }
  );

  const handleFormSubmit = React.useCallback(
    (values: FormValues) => sendConfirmResetPassword(values),
    [sendConfirmResetPassword]
  );

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          mb: 4,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "primary.main",
          }}
        >
          New
        </Typography>
        <Typography variant="h2">password</Typography>
      </Box>
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            autoFocus
            {...field}
            type={showPassword ? "text" : "password"}
            label="New password"
            error={!!error}
            helperText={error?.message}
            sx={{ width: "100%", mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      <Controller
        name="repeated_password"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            autoFocus
            {...field}
            type={showPassword ? "text" : "password"}
            label="Repeat password"
            error={!!error}
            helperText={error?.message}
            sx={{ width: "100%", mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      <OffliButton
        type="submit"
        sx={{ width: "60%", alignSelf: "end" }}
        isLoading={isLoading}
      >
        Reset password
      </OffliButton>
    </form>
  );
};

export default NewPasswordForm;
