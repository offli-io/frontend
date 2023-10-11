import { yupResolver } from "@hookform/resolvers/yup";
import { Box, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import BackButton from "../components/back-button";
import OffliButton from "../components/offli-button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPassword } from "../api/auth/requests";
import { ApplicationLocations } from "../types/common/applications-locations.dto";

export interface FormValues {
  email: string;
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    email: yup.string().email().defined().required(),
  });

const ResetPasswordScreen = () => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  const { isLoading, mutate } = useMutation(
    ["reset-password"],
    (formValues: FormValues) => {
      return resetPassword(formValues);
    },
    {
      onSuccess: (data, params) => {
        toast.success("Verification code was sent to your email");
      },
      onError: (error) => {
        toast.error("Failed to send verification code to given email");
      },
    }
  );

  const handleFormSubmit = React.useCallback(
    (values: FormValues) => console.log(values),
    []
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ height: "100%" }}>
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
        <BackButton href={ApplicationLocations.LOGIN} text="Login" />
        <Typography
          variant="h2"
          sx={{
            mt: 15,
            display: "flex",
            flex: 1,
          }}
        >
          Reset your<Box sx={{ color: "primary.main" }}>&nbsp;password</Box>
        </Typography>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              placeholder="Email alebo mobil"
              error={!!error}
              sx={{ mb: 4, width: "80%", flex: 3 }}
            />
          )}
        />

        <OffliButton
          variant="contained"
          type="submit"
          sx={{ width: "80%", mb: 5 }}
          isLoading={isLoading}
        >
          Send verification code
        </OffliButton>
      </Box>
    </form>
  );
};

export default ResetPasswordScreen;
