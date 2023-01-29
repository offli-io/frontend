import React from "react";
import { Button, SxProps, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export interface IBackButtonProps {
  href: string;
  text: string;
  sxOverrides?: SxProps;
  onClick?: () => void;
}

const BackButton: React.FC<IBackButtonProps> = ({
  href,
  text,
  sxOverrides,
  onClick,
}) => {
  return (
    <Button
      sx={{
        position: "absolute",
        top: 40,
        left: 15,
        textTransform: "none",
        ...sxOverrides,
      }}
      href={href}
      onClick={onClick}
    >
      <ArrowBackIosNewIcon sx={{ height: "20px" }} />
      <Typography variant="subtitle2" sx={{ color: "black", fontSize: 16 }}>
        {text}
      </Typography>
    </Button>
  );
};

export default BackButton;
