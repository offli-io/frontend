import { Box, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import addFriends from "../../../assets/img/add-friends.svg";
import OffliButton from "../../../components/offli-button";

interface INoBuddiesScreenProps {
  onAddBuddiesClick?: () => void;
}

const NoBuddiesScreen: React.FC<INoBuddiesScreenProps> = ({
  onAddBuddiesClick,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={addFriends}
        alt="authentication method"
        style={{ height: "30%" }}
      />
      <Typography
        sx={{ my: 2, color: ({ palette }) => palette?.text?.primary }}
      >
        You have no buddies yet
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
        }}
      >
        <OffliButton color="primary" sx={{ mt: 8 }} onClick={onAddBuddiesClick}>
          Find new buddies
        </OffliButton>
      </Box>
    </Box>
  );
};

export default NoBuddiesScreen;
