import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import OffliButton from "../../../components/offli-button";

interface IResetPasswordFormProps {
  onSuccess: (email: string) => void;
}
const ResetPasswordForm: React.FC<IResetPasswordFormProps> = ({
  onSuccess,
}) => {
  const [email, setEmail] = React.useState("");

  return (
    <>
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
        sx={{ width: "100%", mb: 2 }}
      />

      <OffliButton
        variant="contained"
        type="submit"
        sx={{ width: "50%", alignSelf: "end" }}
        onClick={() => onSuccess(email)}
      >
        Send
      </OffliButton>
    </>
  );
};

export default ResetPasswordForm;
