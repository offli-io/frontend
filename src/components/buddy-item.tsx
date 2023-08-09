import { Box, styled, Typography, useTheme } from "@mui/material";
import userPlaceholder from "../assets/img/user-placeholder.svg";
import React from "react";
import { IPerson } from "../types/activities/activity.dto";
import { useGetApiUrl } from "../hooks/use-get-api-url";

interface IBuddyItemProps {
  buddy: IPerson;
  children?: React.ReactElement;
  actionContent?: React.ReactNode;
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
  const baseUrl = useGetApiUrl();

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          ml: 1,
          maxWidth: "90%",
          overflow: "hidden",
        }}
      >
        <img
          src={
            buddy?.profile_photo
              ? `${baseUrl}/files/${buddy?.profile_photo}`
              : userPlaceholder
          }
          alt="profile"
          style={{
            height: 40,
            width: 40,
            borderRadius: "50%",
            boxShadow: shadows?.[2],
            margin: 1,
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
