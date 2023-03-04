import { Box, Typography, Chip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { getActivity } from "../../api/activities/requests";
import { IActivityRestDto } from "../../types/activities/activity-rest.dto";
import { ICustomizedLocationStateDto } from "../../types/common/customized-location-state.dto";

interface IProps {}

const EditActivityScreen: React.FC<IProps> = () => {
  const { id } = useParams();
  const location = useLocation();
  const from = (location?.state as ICustomizedLocationStateDto)?.from;

  const { data } = useQuery(
    ["activity", id],
    () => getActivity<IActivityRestDto>({ id }),
    {
      enabled: !!id,
    }
  );
  const activity = data?.data?.activity;

  console.log(activity);

  return <div>Easdasdasdadsad</div>;
};
export default EditActivityScreen;
