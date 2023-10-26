import InfoIcon from "@mui/icons-material/Info";
import { Box, TextField, Typography } from "@mui/material";
import OffliButton from "components/offli-button";
import React from "react";
import connectInstagramPhoto from "../../../assets/img/connect-instagram.svg";

export interface IActivityActionsProps {
  instagramUsername?: string | null;
  onButtonClick?: () => void;
}

const InstagramDrawerActions: React.FC<IActivityActionsProps> = ({
  instagramUsername,
  onButtonClick,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Show us your best pictures
      </Typography>
      <Typography sx={{ mb: 2 }}>Connect your instagram with Offli</Typography>
      <img
        src={connectInstagramPhoto}
        alt="connect_instagram"
        style={{ height: 80, margin: 20 }}
      />
      {instagramUsername ? (
        <>
          <TextField
            value={`@${instagramUsername}`}
            disabled
            sx={{
              width: "100%",
              "& input::placeholder": {
                fontSize: 14,
                color: "primary.main",
                opacity: 1,
                pl: 1,
              },
              "& fieldset": { border: "none" },
              backgroundColor: ({ palette }) => palette?.primary?.light,
              borderRadius: "10px",
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", mt: 1.5 }}>
            <InfoIcon sx={{ color: "inactive.main", fontSize: 24 }} />
            <Typography
              variant="subtitle2"
              sx={{ fontSize: 12, textAlign: "center" }}
            >
              For changing your instagram username, you need to disconnect the
              current account
            </Typography>
          </Box>
        </>
      ) : null}
      <OffliButton sx={{ width: "70%", mt: 4 }} onClick={onButtonClick}>
        {instagramUsername ? "Disconnect" : "Connect"}
      </OffliButton>
    </Box>
  );
};

export default InstagramDrawerActions;
