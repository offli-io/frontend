import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import OffliButton from "../../../components/offli-button";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../../api/auth/requests";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface IResetPasswordFormProps {
  onSuccess: (email: string) => void;
}

export interface FormValues {
  email: string;
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    email: yup.string().email().defined().required(),
  });

const ResetPasswordForm: React.FC<IResetPasswordFormProps> = ({
  onSuccess,
}) => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  const { enqueueSnackbar } = useSnackbar();

  const { isLoading, mutate: sendResetPassword } = useMutation(
    ["reset-password"],
    (formValues: FormValues) => {
      return resetPassword(formValues);
    },
    {
      onSuccess: (data, params) => {
        enqueueSnackbar("Verification code was sent to your email");
        onSuccess(params?.email);
      },
      onError: (error) => {
        enqueueSnackbar("Failed to send verification code to given email", {
          variant: "error",
        });
      },
    }
  );

  const handleFormSubmit = React.useCallback(
    (values: FormValues) => sendResetPassword(values),
    [sendResetPassword]
  );

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
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
          Reset
        </Typography>
        <Typography variant="h2">your password</Typography>
      </Box>

      <Typography sx={{ mb: 2 }}>
        We will send you verification code on your email, which will help us
        verify you.
      </Typography>

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            autoFocus
            {...field}
            placeholder="Email"
            error={!!error}
            helperText={error?.message}
            sx={{ mb: 2, width: "100%" }}
          />
        )}
      />

      {/* <TextField
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
        sx={{ width: "100%", mb: 2 }}
      /> */}

      <OffliButton
        variant="contained"
        type="submit"
        sx={{ width: "50%", alignSelf: "end" }}
        isLoading={isLoading}
      >
        Send
      </OffliButton>
    </form>
  );
};

export default ResetPasswordForm;
