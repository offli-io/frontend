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
        flexWrap: "wrap",
        ...sx,
        // overflowWrap: "wrap",
      }}
    >
      {tags?.map((tag, index) => (
        <Chip
          label={tag}
          variant="outlined"
          key={index}
          sx={{
            p: 2,
            my: 0.5,
            borderRadius: "10px",
            borderWidth: "2px",
            border: "solid primary",
            fontSize: "14px",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
          color="primary"
        />
      ))}
    </Box>
  );
};

export default ActivityTags;
