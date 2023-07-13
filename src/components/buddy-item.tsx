import { Box, styled, Typography, useTheme } from "@mui/material";
import logo from "../assets/img/user-placeholder.svg";
import React from "react";
import { IPerson } from "../types/activities/activity.dto";

interface IBuddyItemProps {
  buddy: IPerson;
  children?: React.ReactElement;
  actionContent?: React.ReactElement;
  onClick?: (buddy?: IPerson) => void;
}

const BuddyItem: React.FC<IBuddyItemProps> = ({
  children,
  buddy,
  actionContent,
  onClick,
  ...rest
}) => {
  const { shadows } = useTheme();
  return (
    <Box
      onClick={() => onClick?.(buddy)}
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
      <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
        <img
          src={buddy?.profile_photo_url ?? logo}
          alt="profile"
          style={{
            height: 40,
            width: 40,
            borderRadius: "50%",
            boxShadow: shadows?.[3],
          }}
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
