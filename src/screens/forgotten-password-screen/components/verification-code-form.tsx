import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import OffliButton from "../../../components/offli-button";
import ReactInputVerificationCode from "react-input-verification-code";

interface IVerificationCodeFormProps {
  onSuccess: () => void;
  email: string;
}
const VerificationCodeForm: React.FC<IVerificationCodeFormProps> = ({
  onSuccess,
  email,
}) => {
  return (
    <>
      <Typography variant="h2" sx={{ width: "75%" }} align="left">
        <Box sx={{ color: "primary.main" }}>Confirm</Box>verification code
      </Typography>
      <Typography
        align="center"
        variant="subtitle2"
        sx={{ width: "75%", mt: 2, mb: 3 }}
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
          onSuccess()
        }
      />
      <Box sx={{ display: "flex", mr: -15, alignItems: "center" }}>
        <Typography variant="subtitle2">No email?</Typography>
        <OffliButton variant="text">
          <Typography
            variant="subtitle2"
            sx={{ color: "primary.main", ml: -1 }}
          >
            &nbsp;<b>Resend code</b>
          </Typography>
        </OffliButton>
      </Box>
    </>
  );
};

export default VerificationCodeForm;
