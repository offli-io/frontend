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
import { Link } from "react-router-dom";
import { IActivity } from "../../../types/activities/activity.dto";

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
  lineHeight: 1.2,
  padding: "3%",
  width: "70%",
  inlineSize: "90%",
  overflowWrap: "break-word",
}));

const ActivityDetailsGrid: React.FC<IProps> = ({ activity }) => {
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
          <PeopleAltIcon sx={{ fontSize: 30 }} />
        </IconButton>
        <Link to={""} style={{ textDecoration: "none" }}>
          <Typography align="center" variant="subtitle2">
            show participants
          </Typography>
        </Link>
        <StyledText align="center" variant="subtitle1">
          {/* 1/5 */}
          {activity?.participants?.length}/{activity?.limit}
        </StyledText>
      </StyledBox>
      <StyledBox>
        <IconButton color="primary">
          <CalendarTodayIcon sx={{ fontSize: 26 }} />
        </IconButton>
        <Link to={""} style={{ textDecoration: "none" }}>
          <Typography align="center" variant="subtitle2">
            add to calendar
          </Typography>
        </Link>
        <StyledText align="center" variant="subtitle1">
          {/* 15. September 2022 19:00 */}
          {activity?.datetime_from?.toString()}
        </StyledText>
      </StyledBox>
      <StyledBox>
        <IconButton color="primary">
          <RoomIcon sx={{ fontSize: 30 }} />
        </IconButton>
        <Link to={""} style={{ textDecoration: "none" }}>
          <Typography align="center" variant="subtitle2">
            show on map
          </Typography>
        </Link>
        <StyledText align="center" variant="subtitle1">
          {/* Miletičova 17, Bratislava */}
          {activity?.location?.name}
        </StyledText>
      </StyledBox>
      <StyledBox>
        <IconButton color="primary">
          {/* {price === "free" ? ():()} */}
          {/* MoneyOffIcon */}
          <MonetizationOnIcon sx={{ fontSize: 30 }} />
        </IconButton>
        <Link to={""} style={{ textDecoration: "none" }}>
          <Typography align="center" variant="subtitle2">
            initial price
          </Typography>
        </Link>
        <StyledText align="center" variant="subtitle1">
          {/* Free */}
          {activity?.price}
        </StyledText>
      </StyledBox>
    </Box>
  );
};

export default ActivityDetailsGrid;
