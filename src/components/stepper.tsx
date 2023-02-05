import * as React from "react";
import { SxProps, useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Box } from "@mui/material";

interface IDotsMobileStepperProps {
  containerSx?: SxProps;
}

export default function DotsMobileStepper({
  containerSx,
}: IDotsMobileStepperProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <MobileStepper
      variant="dots"
      steps={6}
      position="static"
      activeStep={activeStep}
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mb: 5,
        ...containerSx,
      }}
      nextButton={<></>}
      backButton={<></>}
    />
  );
}
