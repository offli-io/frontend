import React from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import qs from "qs";
import Logo from "../components/logo";
import authenticationMethod from "../assets/img/authentication-method.svg";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import OffliButton from "../components/offli-button";
import LabeledDivider from "../components/labeled-divider";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  getAuthToken,
  setAuthToken,
  setRefreshToken,
} from "../utils/token.util";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import { useNavigate } from "react-router-dom";
import { DEFAULT_KEYCLOAK_URL } from "../assets/config";
import { loginUser } from "../api/auth/requests";

const AuthenticationMethodScreen: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <Logo />
      <img
        src={authenticationMethod}
        alt="authentication method"
        style={{ height: "30%" }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
        }}
      >
        <OffliButton
          sx={{ width: "80%", mb: 2 }}
          onClick={() => navigate(ApplicationLocations.LOGIN)}
        >
          Login
        </OffliButton>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography>Are you new?</Typography>
          <OffliButton
            color="primary"
            variant="text"
            sx={{ fontSize: "1rem" }}
            onClick={() => navigate(ApplicationLocations.REGISTER)}
          >
            Join now!
          </OffliButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthenticationMethodScreen;
