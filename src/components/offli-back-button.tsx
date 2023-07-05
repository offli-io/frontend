import React from "react";
import { Button, SxProps, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import OffliButton from "./offli-button";

export interface IOffliBackButtonProps {
  onClick?: () => void;
  children: React.ReactElement | string;
  sx?: SxProps;
}

const OffliBackButton: React.FC<IOffliBackButtonProps> = ({
  onClick,
  children,
  sx,
}) => {
  return (
    <OffliButton
      startIcon={<ArrowBackIosNewIcon color="primary" />}
      variant="text"
      sx={{
        fontSize: 16,
        color: ({ palette }) => palette?.text?.primary,
        "& .MuiButton-startIcon": {
          mr: 0.4,
        },
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </OffliButton>
  );
};

export default OffliBackButton;
