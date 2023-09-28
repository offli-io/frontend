import { Box, Card, SxProps, Typography, useTheme } from "@mui/material";
import { CustomizationContext } from "assets/theme/customization-provider";
import { useGetApiUrl } from "hooks/use-get-api-url";
import React from "react";

interface ILastAttendedActivityCardProps {
  label?: string;
  imageUrl?: string;
  sx?: SxProps;
}

const LastAttendedActivityCard: React.FC<ILastAttendedActivityCardProps> = ({
  label,
  imageUrl = "test1.jpg",
  sx,
  ...rest
}) => {
  //TODO maybe in later use also need some refactoring
  const { shadows } = useTheme();
  const { mode } = React.useContext(CustomizationContext);
  const baseUrl = useGetApiUrl();

  return (
    <Card
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        maxHeight: 70,
        borderRadius: 4,
        bgcolor: ({ palette }) => palette.primary.light,
        ...sx,
      }}
      {...rest}
    >
      <Box
        sx={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          overflow: "hidden",
          boxSizing: "border-box",
          px: 1,
        }}
      >
        <Typography
          sx={{
            color: ({ palette }) => palette?.primary?.main,
            fontWeight: "bold",
            display: "block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: 14,
          }}
        >
          {label}
        </Typography>
      </Box>

      <img
        src={`${baseUrl}/files/${imageUrl}`}
        alt="profile"
        style={{
          width: "100%",
          aspectRatio: 4 / 3,
          maxHeight: 70,
          objectFit: "cover",
        }}
      />
    </Card>
  );
};

export default LastAttendedActivityCard;
