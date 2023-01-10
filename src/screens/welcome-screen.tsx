import MaximizeRoundedIcon from "@mui/icons-material/MaximizeRounded";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import OffliButton from "../components/offli-button";

import image from "../assets/img/undraw_super_thank_you_blue.svg";

const WelcomeScreen = () => {
  const [username] = useState("emma.smith");

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
      <MaximizeRoundedIcon
        sx={{ color: "lightgrey", mt: 2, transform: "scale(2.5)", flex: 1 }}
      />
      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flex: 4,
        }}
      >
        <Typography
          align="left"
          variant="h2"
          sx={{ fontSize: "34px", color: "primary.main" }}
        >
          Welcome,
          <Box sx={{ fontSize: "28px", color: "black" }}>{username}!</Box>
        </Typography>
        <img src={image} alt="Background Image" style={{ height: "80px" }} />
      </Box>
      <Typography
        align="center"
        variant="subtitle2"
        sx={{
          fontSize: "20px",
          mt: 5,
          fontWeight: "bold",
        }}
      >
        Thank you, <br />
        <Box sx={{ fontWeight: "normal" }}>
          your registration was successful.
        </Box>
      </Typography>

      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: "bold",
          mt: 4,
          mb: -1,
          ml: -23,
          color: "primary.main",
        }}
      >
        Now you can:
      </Typography>
      <ul style={{ width: "70%", fontSize: "16px", lineHeight: 2 }}>
        <li>
          <Typography>Create & search for activities,</Typography>
        </li>
        <li>
          <Typography>Join the forming groups,</Typography>
        </li>
        <li>
          <Typography>See your scheduled activities,</Typography>
        </li>
        <li>
          <Typography>Enjoy time with your buddies,</Typography>
        </li>
        <li>
          <Typography>
            and Leave feedback on how was the activities, and create safe
            community
          </Typography>
        </li>
      </ul>
      <OffliButton
        sx={{ width: "80%", mt: 2, mb: 5, textTransform: "none" }}
        type="button"
      >
        Let's explore!
      </OffliButton>
    </Box>
  );
};

export default WelcomeScreen;
