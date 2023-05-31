import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import OffliButton from "../../../components/offli-button";
import ReactInputVerificationCode from "react-input-verification-code";
import { useMutation } from "@tanstack/react-query";
import {
  checkVerificationCode,
  resendCode,
  resetPassword,
  verifyEmail,
} from "../../../api/auth/requests";
import { useSnackbar } from "notistack";

interface IVerificationCodeFormProps {
  onSuccess: (code: string) => void;
  email: string;
}
const VerificationCodeForm: React.FC<IVerificationCodeFormProps> = ({
  onSuccess,
  email,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading: isVerifyingEmail, mutate: sendResetPassword } =
    useMutation(
      ["reset-password"],
      (code: string) => {
        return checkVerificationCode({
          email,
          verification_code: code,
        });
      },
      {
        onSuccess: (data, code) => {
          onSuccess(code);
        },
        onError: (error) => {
          //TODO this not might be always the problem check request status
          enqueueSnackbar("Verification code is incorrect", {
            variant: "error",
          });
        },
      }
    );

  const { isLoading: isResendingCode, mutate: sendResendCode } = useMutation(
    ["resend-code"],
    () => {
      return resendCode({
        email,
      });
    },
    {
      onSuccess: (data, code) => {
        enqueueSnackbar("Verification code was re-sent to your email", {
          variant: "success",
        });
      },
      onError: (error) => {
        enqueueSnackbar("Failed to re-send verification code to given email", {
          variant: "error",
        });
      },
    }
  );

  const isLoading = isResendingCode || isVerifyingEmail;

  return (
    <>
      <Typography variant="h2" sx={{ width: "95%" }} align="left">
        <Box sx={{ color: "primary.main" }}>Confirm</Box>verification code
      </Typography>
      <Typography
        align="center"
        variant="subtitle2"
        sx={{ width: "95%", mt: 2, mb: 3 }}
      >
        Take a look for the verification code we just sent you to <b>{email}</b>
        .
      </Typography>
      <Typography variant="subtitle2" sx={{ ml: -25, mb: 1 }}>
        Confirmation code
      </Typography>
      <ReactInputVerificationCode
        autoFocus
        placeholder=""
        length={6}
        onCompleted={(value) =>
          // call mutation if code is correct
          sendResetPassword(value)
        }
      />
      <Box sx={{ display: "flex", mr: -15, alignItems: "center" }}>
        <Typography variant="subtitle2">No email?</Typography>
        <OffliButton
          variant="text"
          isLoading={isLoading}
          onClick={() => sendResendCode()}
          sx={{ fontSize: 18, fontWeight: 600 }}
        >
          Resend code
        </OffliButton>
      </Box>
    </>
  );
};

export default VerificationCodeForm;
