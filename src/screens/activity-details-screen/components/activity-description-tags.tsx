import { Typography, Box, Chip } from "@mui/material";
import React from "react";
import ActivityTags from "./activity-tags";

interface IProps {
  description?: string;
  tags: string[];
}

const ActivityDescriptionTags: React.FC<IProps> = ({ description, tags }) => {
  return (
    <>
      <Typography variant="h5" align="left" sx={{ mt: 2.5 }}>
        Additional description
      </Typography>
      <Typography
        variant="h6"
        align="left"
        sx={{ width: "90%", margin: "auto" }}
      >
        {description}
      </Typography>
      <ActivityTags tags={tags} />
    </>
  );
};

export default ActivityDescriptionTags;
