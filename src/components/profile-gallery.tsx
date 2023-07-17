import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import ProfilePicture from "../assets/img/profilePicture.jpg";
import OffliButton from "./offli-button";
import InstagramIcon from "@mui/icons-material/Instagram";

interface IProfileGalleryProps {
  photoUrls?: string[];
}

const ProfileGallery: React.FC<IProfileGalleryProps> = ({ photoUrls }) => {
  const handleConnectInstagram = React.useCallback(() => {
    window.location.href =
      // "https://api.instagram.com/oauth/authorize?client_id=738841197888411&redirect_uri=https://localhost:3000/profile/&scope=user_profile,user_media&response_type=code";
      "https://api.instagram.com/oauth/authorize?client_id=1317539042184854&redirect_uri=https://localhost:3000/profile/&scope=user_profile,user_media&response_type=code";
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 1.5,
          p: 2,
        }}
      >
        {[...(photoUrls ?? [])]?.length > 0 ? (
          photoUrls?.map((photo) => {
            return (
              <img
                src={photo}
                alt="profile"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: 10,
                  alignSelf: "center",
                  // height: "100%",
                  // borderRadius: 12,
                }}
              />
            );
          })
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
              You have not connected your instagram account yet
            </Typography>
            <OffliButton
              onClick={handleConnectInstagram}
              size="small"
              variant="outlined"
              sx={{ fontSize: 16, mt: 2 }}
              startIcon={<InstagramIcon />}
            >
              Connect instagram
            </OffliButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfileGallery;
