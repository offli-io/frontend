import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import BackButton from "../components/back-button";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Logo from "../components/logo";
import OffliButton from "../components/offli-button";

import backgroundImage from "../assets/img/undraw_real_life_blue.svg";
import { PageWrapper } from "../components/page-wrapper";

const LoginOrRegisterScreen = () => {
  return (
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
      <Box sx={{ mt: 10, flex: 1 }}>
        <Logo />
      </Box>
      <img
        src={backgroundImage}
        alt="Background"
        style={{ height: "25%", marginBottom: "30%" }}
      />
      <OffliButton to="/login" sx={{ width: "80%", mb: 1 }}>
        Login
      </OffliButton>
      <OffliButton to="/register" variant="text" sx={{ width: "80%", mb: 3 }}>
        Register
      </OffliButton>
    </Box>
  );
};

export default LoginOrRegisterScreen;
