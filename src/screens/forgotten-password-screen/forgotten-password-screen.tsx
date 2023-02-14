import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import BackButton from "../../components/back-button";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import OffliButton from "../../components/offli-button";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import ErrorIcon from '@mui/icons-material/Error'
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import ResetPasswordForm from "./components/reset-password-form";
import VerificationCodeForm from "./components/verification-code-form";
import NewPasswordForm from "./components/new-password-form";
import { useNavigate } from "react-router-dom";

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
  const [verificationCode, setVerificationCode] = React.useState("");
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const [activeStep, setActiveStep] = React.useState(2);

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

  const generateBackButtonLabel = React.useCallback(() => {
    if (activeStep === 0) {
      return "Login";
    }
    if (activeStep === 1) {
      return "Email";
    }
    if (activeStep === 2) {
      return "Code confirmation";
    }
    return "";
  }, [activeStep]);

  const handleBackClicked = React.useCallback(() => {
    if (activeStep === 0) {
      return navigate(ApplicationLocations.LOGIN);
    }
    setActiveStep((activeStep) => activeStep - 1);
  }, [activeStep, setActiveStep, navigate]);

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
        // move little bit upper to have space for mobile keyboard
        pb: 10,
        boxSizing: "border-box",
      }}
    >
      <BackButton
        sxOverrides={{ top: 20, left: 10 }}
        text={generateBackButtonLabel()}
        onClick={handleBackClicked}
      />

      {activeStep === 0 && (
        <ResetPasswordForm
          onSuccess={(email: string) => {
            setEmail(email);
            setActiveStep((activeStep) => activeStep + 1);
          }}
        />
      )}
      {activeStep === 1 && (
        <VerificationCodeForm
          email={email}
          onSuccess={(code) => {
            setVerificationCode(code);
            setActiveStep((activeStep) => activeStep + 1);
          }}
        />
      )}
      {activeStep === 2 && (
        <NewPasswordForm
          email={email}
          verificationCode={verificationCode}
          onSuccess={() => navigate(ApplicationLocations.LOGIN)}
        />
      )}
    </Box>
  );
};

export default ForgottenPasswordScreen;
