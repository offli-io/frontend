import React from "react";
import { IActivity } from "../../../types/activities/activity.dto";
import { log } from "console";

interface IProps {
  activity: IActivity;
}

const MapDetail: React.FC<IProps> = ({ activity }) => {
  console.log(activity);

  return <div>MapDetail</div>;
};

export default MapDetail;
