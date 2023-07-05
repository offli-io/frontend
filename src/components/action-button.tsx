import React from "react";

import {
  Button,
  ButtonProps,
  CircularProgress,
  SxProps,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

interface IProps extends ButtonProps {
  type?: "button" | "reset" | "submit" | undefined;
  text: string;
  sx?: SxProps;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const ActionButton: React.FC<IProps> = ({
  type,
  text,
  sx,
  onClick,
  href,
  disabled,
  isLoading,
  ...rest
}) => {
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
      data-testid="action-button"
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <CircularProgress size={20} color="primary" sx={{ mr: 1.5 }} />
      ) : null}
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
