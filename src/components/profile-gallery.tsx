import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import ProfilePicture from "../assets/img/profilePicture.jpg";
import OffliButton from "./offli-button";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useGetApiUrl } from "../hooks/use-get-api-url";

interface IProfileGalleryProps {
  photoUrls?: string[];
}

const ProfileGallery: React.FC<IProfileGalleryProps> = ({ photoUrls }) => {
  const { shadows } = useTheme();
  const handleConnectInstagram = React.useCallback(() => {
    window.location.href =
      // "https://api.instagram.com/oauth/authorize?client_id=738841197888411&redirect_uri=https://localhost:3000/profile/&scope=user_profile,user_media&response_type=code";
      `https://api.instagram.com/oauth/authorize?client_id=1317539042184854&redirect_uri=${window.location.href}/&scope=user_profile,user_media&response_type=code`;
  }, []);

  const baseUrl = useGetApiUrl();
  const firstSplittedPhotos: string[] = [];
  const secondSplittedPhotos: string[] = [];

  photoUrls?.forEach((photo, index) => {
    if (index % 2 === 0) {
      firstSplittedPhotos.push(photo);
    } else {
      secondSplittedPhotos.push(photo);
    }
  });

  return (
    <Box sx={{ p: 1 }}>
      {[...(firstSplittedPhotos ?? [])]?.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
          }}
        >
          <>
            <Box>
              {firstSplittedPhotos?.map((photo) => (
                <img
                  src={`${baseUrl}/files/${photo}`}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: 10,
                    alignSelf: "center",
                    marginBottom: 8,
                    boxShadow: shadows[5],
                  }}
                />
              ))}
            </Box>
            <Box>
              {secondSplittedPhotos?.map((photo) => (
                <img
                  src={`${baseUrl}/files/${photo}`}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: 10,
                    alignSelf: "center",
                    marginBottom: 8,
                    boxShadow: shadows[5],
                  }}
                />
              ))}
            </Box>
          </>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="subtitle1" sx={{ textAlign: "center", px: 4 }}>
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
  );
};

export default ProfileGallery;
