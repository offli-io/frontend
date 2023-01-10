import React from "react";
import { Box, Typography, IconButton, styled } from "@mui/material";
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PaidIcon from "@mui/icons-material/Paid";
import PlaceIcon from "@mui/icons-material/Place";
import TimerIcon from "@mui/icons-material/Timer";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonIcon from "@mui/icons-material/Person";
import logo from "../assets/img/profilePicture.jpg";
import logoChlap from "../assets/img/jozo.png";

interface IChatItemProps {
  picture?: string;
  message: string;
}

const StyledImage = styled((props: any) => (
  <img {...props} alt="Chat profile pic" />
))`
  height: 30px;
  width: 30px;
  //border: ${({ theme }) => `0.5px solid ${theme.palette.inactive.main}`};

  box-shadow: 1px 3px 2px #ccc;
  border-radius: 50%;
`;

const ChatItem: React.FC<IChatItemProps> = ({ message, picture }) => {
  return (
    <Box
      sx={{
        width: "100%",
        border: (theme) => `1px solid ${theme.palette.inactive.main}`,
        pt: 2,
        pb: 1,
        px: 2,
        borderRadius: 2,
        boxSizing: "border-box",
        position: "relative",
        my: 2,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: -12,
          top: -15,
          borderRadius: 50,
        }}
      >
        {/* TODO Nejaku defaultnu fotku sem nastavit [png, svg] */}
        <StyledImage src={picture ?? logo} alt="profile picture" />
      </Box>
      <Typography>{message}</Typography>
    </Box>
  );
};

export default ChatItem;
