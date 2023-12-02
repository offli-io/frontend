import { Box, Typography } from "@mui/material";
import React from "react";

import activityCreatedImg from "../../assets/img/activity-created.svg";
import OffliButton from "components/offli-button";
import { useNavigate } from "react-router-dom";
import { ApplicationLocations } from "types/common/applications-locations.dto";

interface IRegistrationNeededScreenProps {}

interface LottieProps {
  animationData: any;
  width: number;
  height: number;
}

const RegistrationNeededScreen: React.FC<
  IRegistrationNeededScreenProps
> = ({}) => {
  const element = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0px !important;",
      }}
    >
      <Box sx={{ position: "absolute", zIndex: 500 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Activity created !
        </Typography>
        <img
          src={activityCreatedImg}
          alt="Offli logo"
          style={{ height: "150px" }}
        />
      </Box>
      <OffliButton onClick={() => navigate(ApplicationLocations.REGISTER)}>
        Register
      </OffliButton>
    </Box>
  );
};

export default RegistrationNeededScreen;
