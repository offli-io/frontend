import { Box, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import ReactInputVerificationCode from "react-input-verification-code";
import { toast } from "sonner";
import { checkVerificationCode, resendCode } from "../../../api/auth/requests";
import OffliButton from "../../../components/offli-button";

interface IVerificationCodeFormProps {
  onSuccess: (code: string) => void;
  email: string;
}
const VerificationCodeForm: React.FC<IVerificationCodeFormProps> = ({
  onSuccess,
  email,
}) => {
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
          toast.error("Verification code is incorrect");
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
        toast.success("Verification code was re-sent to your email");
      },
      onError: (error) => {
        toast.error("Failed to re-send verification code to given email");
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
        placeholder=""
        length={6}
        onCompleted={(value) =>
          // call mutation if code is correct
          sendResetPassword(value)
        }
        dataCy="verification-code-input"
      />
      <Box sx={{ display: "flex", mr: -15, alignItems: "center" }}>
        <Typography variant="subtitle2">No email?</Typography>
        <OffliButton
          variant="text"
          isLoading={isLoading}
          onClick={() => sendResendCode()}
          sx={{ fontSize: 18, fontWeight: 600 }}
          data-testid="resend-code-btn"
        >
          Resend code
        </OffliButton>
      </Box>
    </>
  );
};

export default VerificationCodeForm;
