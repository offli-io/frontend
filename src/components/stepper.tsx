import * as React from "react";
import { SxProps, useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Box } from "@mui/material";

interface IDotsMobileStepperProps {
  containerSx?: SxProps;
  activeStep: number;
}

export default function DotsMobileStepper({
  containerSx,
  activeStep,
}: IDotsMobileStepperProps) {
  const theme = useTheme();

  return (
    <MobileStepper
      variant="progress"
      steps={6}
      position="static"
      activeStep={activeStep}
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 8,
        "& span": {
          width: "100%",
        },
        ...containerSx,
      }}
      nextButton={<></>}
      backButton={<></>}
    />
  );
}
