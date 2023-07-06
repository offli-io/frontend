import { Chip } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

interface IProps {
  tags?: string[];
}

const ActivityTags: React.FC<IProps> = ({ tags }) => {
  return (
    <Box
      sx={{
        width: "90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        my: 2,
        px: 3,
        // overflowWrap: "wrap",
      }}
    >
      {tags?.map((tag, index) => (
        <Chip
          label={tag}
          key={index}
          sx={{
            p: 2.5,
            borderRadius: "10px",
            fontSize: "14px",
            textTransform: "capitalize",
          }}
          color="primary"
        />
      ))}
    </Box>
  );
};

export default ActivityTags;
