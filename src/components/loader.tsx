import {
  Box,
  CardActionArea,
  CircularProgress,
  DividerProps,
  SxProps,
} from "@mui/material";
import logo from "../assets/img/gym.svg";
import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface ILoaderProps {
  containerSx?: SxProps;
}

const Loader: React.FC<ILoaderProps> = ({ containerSx, ...rest }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        my: 2,
        ...containerSx,
      }}
    >
      <CircularProgress size={30} />
    </Box>
  );
};
export default Loader;
