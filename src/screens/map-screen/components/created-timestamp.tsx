import { Box, Typography, styled } from "@mui/material";
import React from "react";

const MainBox = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignContent: "center",
  justifyContent: "center",
  marginTop: "10%",
}));

interface IProps {
  timestamp?: string;
}

const CreatedTimestamp: React.FC<IProps> = ({ timestamp }) => {
  return (
    <MainBox>
      <Typography
        variant="subtitle2"
        align="center"
        sx={{ fontSize: 12, color: "grey" }}
      >
        Created {timestamp}
      </Typography>
    </MainBox>
  );
};

export default CreatedTimestamp;
