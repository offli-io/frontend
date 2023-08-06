import { Box, Button, Checkbox, styled, Typography } from "@mui/material";
import logo from "../assets/img/profilePicture.jpg";
import React from "react";
import OffliButton from "./offli-button";
import { IPerson } from "../types/activities/activity.dto";
import { useGetApiUrl } from "../hooks/use-get-api-url";

interface ILabeledDividerProps {
  imageSource?: string;
  onInviteClick?: (person: IPerson) => void;
  buddy: IPerson;
  children?: React.ReactElement;
  invited?: boolean;
}

const StyledImage = styled((props: any) => (
  <img {...props} alt="Buddy item invite" />
))`
  height: 40px;
  width: 40px;
  backgroundcolor: #c9c9c9;
  border-radius: 50%;
`;

const BuddyItemInvite: React.FC<ILabeledDividerProps> = ({
  children,
  buddy,
  onInviteClick,
  invited,
  ...rest
}) => {
  const baseUrl = useGetApiUrl();
  return (
    <Box
      //onClick={() => handleClick(checked)}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
        textTransform: "none",
        width: "100%",
      }}
      {...rest}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <StyledImage
          src={
            buddy?.profile_photo
              ? `${baseUrl}/files/${buddy?.profile_photo}`
              : logo
          }
          alt="profile picture"
        />
        <Typography sx={{ ml: 2, color: "black" }}>
          {buddy?.username}
        </Typography>
      </Box>
      <OffliButton
        sx={{ height: 30, fontSize: 16 }}
        onClick={() => onInviteClick && onInviteClick(buddy)}
        variant={invited ? "outlined" : "contained"}
        data-testid="toggle-buddy-invite-btn"
      >
        {invited ? "Cancel" : "Invite"}
      </OffliButton>
    </Box>
  );
};
export default BuddyItemInvite;
