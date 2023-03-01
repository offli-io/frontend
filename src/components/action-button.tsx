import React from "react";

import { Button, Typography, SxProps } from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import { ApplicationLocations } from "../types/common/applications-locations.dto";

interface IProps {
  type?: "button" | "reset" | "submit" | undefined;
  text: string;
  sx?: SxProps;
  onClick?: () => void;
  href?: string;
}

const ActionButton: React.FC<IProps> = ({ type, text, sx, onClick, href }) => {
  return (
    <Button
      sx={{
        ...sx,
        width: "60%",
        borderRadius: "15px",
        backgroundColor: (theme) => theme.palette.primary.light,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2%",
      }}
      type={type}
      onClick={onClick}
    >
      {href ? (
        <Link to={href!} style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            {text}
          </Typography>
        </Link>
      ) : (
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          {text}
        </Typography>
      )}
    </Button>
  );
};

export default ActionButton;
