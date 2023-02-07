import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import LabeledTile from "../../../components/labeled-tile";
import OffliButton from "../../../components/offli-button";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { getPredefinedTags } from "../../../api/activities/requests";
import { useQuery } from "@tanstack/react-query";

interface IActivityTypeFormProps {
  onNextClicked: () => void;
  onBackClicked: () => void;
  methods: UseFormReturn;
}

const activityTypes = [
  "Sports and drinks",
  "Relax",
  "Cinema",
  "Food",
  "Music",
  "Nature",
  "Adrenaline",
  "Charitable",
];

export const ActivityTypeForm: React.FC<IActivityTypeFormProps> = ({
  onNextClicked,
  onBackClicked,
  methods,
}) => {
  const { control, setValue, watch } = methods;

  const tags: string[] = watch("tags") ?? [];

  const { data: { data: { tags: tiles = [] } = {} } = {}, isLoading } =
    useQuery(["predefined-tags"], () => getPredefinedTags(), {});

  const handleTileClick = React.useCallback(
    (title: string) => {
      if (tags?.includes(title)) {
        const updatedTags = tags.filter((tag: string) => tag !== title);
        setValue("tags", updatedTags);
      } else {
        const updatedTags = [...tags, title];
        setValue("tags", updatedTags);
      }
    },
    [tags, setValue]
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Typography variant="h2" sx={{ mr: 1, color: "primary.main" }}>
            Choose
          </Typography>
          <Typography variant="h2">category</Typography>
        </Box>
        <Typography variant="subtitle2">
          You can pick none, or more categories
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              my: 4,
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : (
          tiles?.map(({ title, picture }, index) => (
            <LabeledTile
              key={index}
              title={title}
              onClick={handleTileClick}
              sx={{
                width: "42%",
                mb: 2,
              }}
              imageUrl={picture}
            />
          ))
        )}
        {/* <LabeledTile title="Sports and drinks" onClick={handleTileClick} />
        <LabeledTile title="Relax" sx={{ ml: 3 }} onClick={handleTileClick} /> */}
      </Box>

      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}
      >
        <IconButton onClick={onBackClicked} color="primary">
          <ArrowBackIosNewIcon />
        </IconButton>
        {/* <OffliButton
          onClick={onBackClicked}
          sx={{ width: '40%' }}
          variant="text"
        >
          Back
        </OffliButton> */}
        <OffliButton
          onClick={onNextClicked}
          sx={{ width: "40%" }}
          //disabled={!formState.isValid}
        >
          Next
        </OffliButton>
      </Box>
    </>
  );
};
