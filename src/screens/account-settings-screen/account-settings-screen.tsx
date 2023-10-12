import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
// import ErrorIcon from '@mui/icons-material/Error'
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { PageWrapper } from "components/page-wrapper";
import OffliButton from "components/offli-button";
import { useMutation } from "@tanstack/react-query";
import { loginViaGoogle } from "api/auth/requests";
import { toast } from "sonner";
import { ApplicationLocations } from "types/common/applications-locations.dto";

export interface FormValues {
  oldPassword: string;
  newPassword: string;
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    oldPassword: yup.string().defined().required(),
    newPassword: yup.string().defined().required(),
  });

const AccountSettingsScreen = () => {
  const [visiblePassword, setVisiblePassword] = React.useState<number | null>(
    null
  );
  const navigate = useNavigate();

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  const { isLoading: isChangingPassword, mutate: sendChangePassword } =
    useMutation(
      ["change-password"],
      (values: FormValues) => {
        // abortControllerRef.current = new AbortController();
        return loginViaGoogle(
          values?.newPassword
          //   abortControllerRef?.current?.signal
        );
      },
      {
        onSuccess: (data, params) => {
          toast.success("Your password has been successfully changed");
          navigate(-1);
        },
        onError: (error) => {
          toast.error("Failed to change your password");
        },
      }
    );

  const handleFormSubmit = React.useCallback((values: FormValues) => {
    sendChangePassword(values);
  }, []);

  return (
    <PageWrapper
      sxOverrides={{ alignItems: "flex-start", px: 2, boxSizing: "border-box" }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Typography align="left" variant="h5" sx={{ mb: 3, mt: 1 }}>
          Password change
        </Typography>
        <Controller
          name="oldPassword"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              data-testid="password-input"
              label="Current password"
              type={visiblePassword === 1 ? "text" : "password"}
              error={!!error}
              sx={{ width: "100%", mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setVisiblePassword((visiblePassword) =>
                          visiblePassword === 1 ? null : 1
                        )
                      }
                    >
                      {visiblePassword === 1 ? (
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
        <Controller
          name="newPassword"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              data-testid="password-input"
              label="New password"
              type={visiblePassword === 2 ? "text" : "password"}
              error={!!error}
              sx={{ width: "100%" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setVisiblePassword((visiblePassword) =>
                          visiblePassword === 2 ? null : 2
                        )
                      }
                    >
                      {visiblePassword === 2 ? (
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
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <OffliButton
            data-testid="change-password-btn"
            sx={{ px: 4, mt: 4, fontSize: 18 }}
            type="submit"
            isLoading={isChangingPassword}
            disabled={!formState?.isValid}
          >
            Change password
          </OffliButton>
        </Box>
      </form>
    </PageWrapper>
  );
};

export default AccountSettingsScreen;
