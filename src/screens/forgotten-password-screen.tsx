import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import BackButton from "../components/back-button";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import OffliButton from "../components/offli-button";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import ErrorIcon from '@mui/icons-material/Error'
import { ApplicationLocations } from "../types/common/applications-locations.dto";

export interface FormValues {
  password: string;
}

const schema: () => yup.SchemaOf<FormValues> = () =>
  yup.object({
    password: yup.string().defined().required(),
  });

const ForgottenPasswordScreen = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      password: "",
    },
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  const handleFormSubmit = React.useCallback(
    (values: FormValues) => console.log(values),
    []
  );

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
        boxSizing: "border-box",
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
          Reset
        </Typography>
        <Typography variant="h2">your password</Typography>
      </Box>

      <Typography sx={{ mb: 2 }}>
        We will send you verification code on your email, which will help us
        verify you.
      </Typography>

      <TextField
        //autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
        sx={{ width: "100%", mb: 2 }}
        // helperText={
        //   error?.message ||
        //   t(`value.${nextStep?.authenticationType}.placeholder`)
        // }
        //disabled={methodSelectionDisabled}
        // sx={{ mb: 4, width: "70%", flex: 3 }}
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
        sx={{ width: "50%", alignSelf: "end" }}
        onClick={() => console.log(email)}
      >
        Send
      </OffliButton>
    </Box>
  );
};

export default ForgottenPasswordScreen;
