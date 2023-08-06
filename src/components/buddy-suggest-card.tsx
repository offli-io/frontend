import { Box, styled, Typography } from "@mui/material";
import personPlaceholderImage from "../assets/img/person-placeholder-image.svg";
import React from "react";
import { IPerson } from "../types/activities/activity.dto";
import OffliButton from "./offli-button";
import { useGetApiUrl } from "../hooks/use-get-api-url";

interface ILabeledDividerProps {
  buddy: IPerson;
  children?: React.ReactElement;
  onAddBuddyClick?: (buddy: IPerson) => void;
  isLoading?: boolean;
}

const StyledImage = styled((props: any) => <img {...props} alt="Buddy item" />)`
  height: 80px;
  width: 80px;
  backgroundcolor: #c9c9c9;
  border-radius: 50%;
`;

const BuddySuggestCard: React.FC<ILabeledDividerProps> = ({
  children,
  buddy,
  onAddBuddyClick,
  isLoading,
  ...rest
}) => {
  const baseUrl = useGetApiUrl();

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.primary.light,
        p: 1.5,
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 110,
        mx: 1,
      }}
    >
      <StyledImage
        src={
          buddy?.profile_photo
            ? `${baseUrl}/files/${buddy?.profile_photo}`
            : personPlaceholderImage
        }
        alt="profile picture"
      />
      <Typography variant="h6" sx={{ m: 1 }}>
        {buddy?.username}
      </Typography>
      <OffliButton
        onClick={() => onAddBuddyClick?.(buddy)}
        sx={{ fontSize: 14 }}
        isLoading={isLoading}
      >
        Add buddy
      </OffliButton>
    </Box>
  );
};
export default BuddySuggestCard;
