import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { getActivity } from "../../api/activities/requests";
import { IActivityRestDto } from "../../types/activities/activity-rest.dto";
import { ICustomizedLocationStateDto } from "../../types/common/customized-location-state.dto";
import ActivityDetailsScreenLayout from "./components/activity-details-screen-layout";
import BackHeader from "../../components/back-header";

interface IProps {
  type: "detail" | "request";
}

const ActivityDetailsScreen: React.FC<IProps> = ({ type }) => {
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

  return (
    <>
      {type === "request" && <BackHeader title="Activity invite" to={from} />}
      <ActivityDetailsScreenLayout activity={activity} />
    </>
  );
};

export default ActivityDetailsScreen;
