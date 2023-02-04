import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import BackButton from "../components/back-button";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import OffliButton from "../components/offli-button";
// import ErrorIcon from '@mui/icons-material/Error'
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
              autoFocus
              {...field}
              //label="Username"
              placeholder="Email alebo mobil"
              // variant="filled"
              error={!!error}
              // helperText={
              //   error?.message ||
              //   t(`value.${nextStep?.authenticationType}.placeholder`)
              // }
              //disabled={methodSelectionDisabled}
              sx={{ mb: 4, width: "80%", flex: 3 }}
            />
          )}
        />
        {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, ml: -15 }}>
          <ErrorIcon sx={{ color: 'red', height: '18px' }} />
          <Typography variant="subtitle2" sx={{ color: 'red' }}>
            Username is taken!
          </Typography>
        </Box> */}
        <OffliButton
          variant="contained"
          type="submit"
          sx={{ width: "80%", mb: 5 }}
        >
          Send verification code
        </OffliButton>
      </Box>
    </form>
  );
};

export default ResetPasswordScreen;
