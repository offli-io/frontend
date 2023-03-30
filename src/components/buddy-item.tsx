import { Box, styled, Typography } from "@mui/material";
import logo from "../assets/img/profilePicture.jpg";
import React from "react";
import { IPerson } from "../types/activities/activity.dto";

interface ILabeledDividerProps {
  buddy: IPerson;
  children?: React.ReactElement;
  actionContent?: React.ReactElement;
}

const StyledImage = styled((props: any) => <img {...props} alt="Buddy item" />)`
  height: 40px;
  width: 40px;
  backgroundcolor: #c9c9c9;
  border-radius: 50%;
`;

const BuddyItem: React.FC<ILabeledDividerProps> = ({
  children,
  buddy,
  actionContent,
  ...rest
}) => {
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
          src={buddy?.profile_photo_url ?? logo}
          alt="profile picture"
        />
        <Typography sx={{ ml: 2, color: "black" }}>
          {buddy?.username}
        </Typography>
      </Box>
      {actionContent}
    </Box>
  );
};
export default BuddyItem;
