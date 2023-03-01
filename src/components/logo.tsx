import React from "react";
import { Box, SxProps } from "@mui/material";
import logo from "../assets/img/logoPurple.png";

interface ILogoProps {
  sx?: SxProps;
}

const Logo: React.FC<ILogoProps> = ({ sx }) => {
  return (
    <Box
      component="img"
      sx={{
        //   height: 233,
        //   width: 350,
        maxHeight: { xs: 120, md: 220 },
        maxWidth: { xs: 170, md: 360 },
        ...sx,
      }}
      alt="The house from the offer."
      src={logo}
    />
  );
};

export default Logo;
