import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RoomIcon from "@mui/icons-material/Room";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import React from "react";
import IconInformationRow from "./icon-information-row";

const MainBox = styled(Box)(() => ({
  width: "95%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  marginTop: "5%",
}));

interface IProps {
  locationName?: string;
  dateTime?: string;
  price?: number | null;
  participantsNum?: string;
}

const BasicInformation: React.FC<IProps> = ({
  locationName,
  dateTime,
  price,
  participantsNum,
}) => {
  return (
    <MainBox>
      <Typography variant="h3" sx={{ mb: 1 }}>
        Basic information
      </Typography>
      <IconInformationRow icon={RoomIcon} text={locationName} />
      <IconInformationRow icon={CalendarTodayIcon} text={dateTime} />
      <IconInformationRow
        icon={MonetizationOnIcon}
        text={price ? String(price) : "free"}
      />
      <IconInformationRow icon={PeopleAltIcon} text={participantsNum} />
    </MainBox>
  );
};

export default BasicInformation;
