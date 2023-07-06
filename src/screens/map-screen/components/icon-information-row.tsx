import { Icon, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import React from "react";

const MainBox = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  marginBottom: 5,
}));

interface IProps {
  icon: React.ElementType;
  text?: string;
}

const IconInformationRow: React.FC<IProps> = ({ icon, text }) => {
  return (
    <MainBox>
      {React.createElement(icon, {
        fontSize: "1rem",
        color: "primary",
      })}
      <Typography variant="subtitle1" sx={{ pl: 3 }}>
        {text}
      </Typography>
    </MainBox>
  );
};

export default IconInformationRow;
