import { Box, Typography, styled } from "@mui/material";
import React from "react";

const MainBox = styled(Box)(() => ({
  width: "95%",
  display: "flex",
  flexDirection: "column",
  alignContent: "center",
  justifyContent: "center",
  marginTop: "5%",
}));

const TextBox = styled(Box)(() => ({
  maxWidth: "90%",
  lineHeight: 1,
  display: "flex",
  alignContent: "center",
  justifyContent: "flex-start",
  marginLeft: "1%",
  marginTop: "1%",
}));

interface IProps {
  duration?: string;
}

const ActivityDuration: React.FC<IProps> = ({ duration }) => {
  return (
    <MainBox>
      <Typography variant="h3" align="left">
        Additional description
      </Typography>
      <TextBox>
        <Typography variant="subtitle1">{duration}</Typography>
      </TextBox>
    </MainBox>
  );
};

export default ActivityDuration;
