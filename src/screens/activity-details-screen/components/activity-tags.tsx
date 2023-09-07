import { Chip, SxProps } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

interface IProps {
  tags?: string[];
  sx?: SxProps;
}

const ActivityTags: React.FC<IProps> = ({ tags, sx }) => {
  return (
    <Box
      sx={{
        width: "90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        my: 2,
        px: 3,
        flexWrap: "wrap",
        ...sx,
        // overflowWrap: "wrap",
      }}
    >
      {tags?.map((tag, index) => (
        <Chip
          label={tag}
          key={index}
          sx={{
            p: 2,
            borderRadius: "10px",
            fontSize: "14px",
            textTransform: "capitalize",
            mx: 1,
            my: 0.5,
          }}
          color="primary"
        />
      ))}
    </Box>
  );
};

export default ActivityTags;
