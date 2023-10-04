import { Box, CardActionArea, DividerProps, SxProps } from "@mui/material";
import logo from "../assets/img/gym.svg";
import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface ILabeledTileProps {
  title: string;
  imageUrl?: string;
  sx?: SxProps;
  selected?: boolean;
  onClick: (title: string) => void;
}

const LabeledTile: React.FC<ILabeledTileProps> = ({
  title,
  imageUrl,
  sx,
  selected,
  onClick,
  ...rest
}) => {
  const handleCardClick = React.useCallback(() => {
    onClick(title);
  }, [onClick]);

  return (
    <Card
      sx={{
        backgroundColor: "transparent",
        position: "relative",
        width: 150,
        height: 115,
        borderRadius: 3,
        ...(selected
          ? { border: (theme) => `2px solid ${theme.palette.primary.main}` }
          : { border: (theme) => `2px solid ${theme.palette.primary.light}` }),
        ...sx,
      }}
    >
      <Button
        sx={{ bgcolor: "transparent", width: "100%", height: "100%" }}
        onClick={handleCardClick}
        data-testid="labeled-tile-btn"
        {...rest}
      >
        <img
          alt="Labeled tile"
          src={imageUrl ?? logo}
          style={{
            width: "100%",
            height: 115,
            maxWidth: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            opacity: selected ? 0.9 : 0.5,
            objectFit: "contain",
          }}
        ></img>
        <Box sx={{ position: "absolute", bottom: 10, left: 10, width: "60%", textAlign: "start" }}>
          <Typography
            sx={{
              color: "primary.main",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {title}
          </Typography>
        </Box>
      </Button>
    </Card>
  );
};
export default LabeledTile;
