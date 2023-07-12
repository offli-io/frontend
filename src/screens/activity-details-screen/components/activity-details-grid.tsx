import React from "react";
import { Box, Grid, IconButton, Typography, styled } from "@mui/material";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RoomIcon from "@mui/icons-material/Room";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IActivity } from "../../../types/activities/activity.dto";
import { ApplicationLocations } from "../../../types/common/applications-locations.dto";
import { ICustomizedLocationStateDto } from "../../../types/common/customized-location-state.dto";
import { format } from "date-fns";
import { DATE_TIME_FORMAT } from "../../../utils/common-constants";
import OffliButton from "../../../components/offli-button";

interface IProps {
  activity?: IActivity;
}

const StyledBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  borderRadius: "10px",
  backgroundColor: "#E4E3FF",
  paddingTop: "2%",
  paddingBottom: "2%",
  maxWidth: "45vw",
}));

const StyledText = styled(Typography)(() => ({
  display: "block",
  width: "80%",
  textOverflow: "ellipsis",
  wordWrap: "break-word",
  overflow: "hidden",
  maxHeight: "2.8rem",
  lineHeight: "1.4rem",
}));

const ActivityDetailsGrid: React.FC<IProps> = ({ activity }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  console.log(pathname);
  // const from = (location?.state as ICustomizedLocationStateDto)?.from;

  const handleShowOnMap = () => {
    navigate(`${ApplicationLocations.MAP}/${activity?.id}`, {
      state: {
        from: `${ApplicationLocations.ACTIVITY_DETAIL}/${activity?.id}`,
      },
    });
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridAutoFlow: "row",
        rowGap: "7px",
        columnGap: "5px",
        ml: 0.2,
        mt: 0.5,
      }}
    >
      <StyledBox>
        <IconButton color="primary">
          <PeopleAltIcon sx={{ fontSize: 26 }} />
        </IconButton>
        <OffliButton
          onClick={() =>
            navigate(`${ApplicationLocations.ACTIVITY_MEMBERS}/${activity?.id}`)
          }
          variant="text"
          size="small"
          sx={{ textDecoration: "none", fontSize: 16, p: 0, m: 0 }}
        >
          Show participants
        </OffliButton>
        <StyledText align="center" variant="subtitle1">
          {activity?.count_confirmed}/{activity?.limit}
        </StyledText>
      </StyledBox>
      <StyledBox>
        <IconButton color="primary">
          <CalendarTodayIcon sx={{ fontSize: 26 }} />
        </IconButton>
        <OffliButton
          onClick={() => console.log("add to calendar")}
          variant="text"
          size="small"
          sx={{ textDecoration: "none", fontSize: 16, p: 0, m: 0 }}
        >
          Add to calendar
        </OffliButton>

        <StyledText align="center" variant="subtitle1">
          {activity?.datetime_from
            ? format(new Date(activity?.datetime_from), DATE_TIME_FORMAT)
            : "-"}
        </StyledText>
      </StyledBox>
      <StyledBox>
        <IconButton color="primary">
          <RoomIcon sx={{ fontSize: 26 }} />
        </IconButton>
        <OffliButton
          onClick={() =>
            navigate(`${ApplicationLocations.MAP}/${activity?.id}`, {
              state: {
                from: pathname,
              },
            })
          }
          variant="text"
          size="small"
          sx={{ textDecoration: "none", fontSize: 16, p: 0, m: 0 }}
        >
          Show on map
        </OffliButton>
        <StyledText align="center" variant="subtitle1">
          {activity?.location?.name}
        </StyledText>
      </StyledBox>
      <StyledBox>
        <IconButton color="primary">
          <MonetizationOnIcon sx={{ fontSize: 26 }} />
        </IconButton>
        <OffliButton
          onClick={() => console.log("show on map")}
          variant="text"
          size="small"
          sx={{ textDecoration: "none", fontSize: 16, p: 0, m: 0 }}
        >
          Initial price
        </OffliButton>
        <StyledText align="center" variant="subtitle1">
          {activity?.price ?? "-"}
        </StyledText>
      </StyledBox>
    </Box>
  );
};

export default ActivityDetailsGrid;
