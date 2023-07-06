import { IconButton, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NearMeIcon from "@mui/icons-material/NearMe";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import React from "react";

interface IProps {
  participantsNum?: string;
  dateTime?: string;
  distance?: string;
  price?: string;
}

const StyledBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  borderRadius: "10px",
  backgroundColor: "#E4E3FF",
  // paddingTop: "2%",
  // paddingBottom: "2%",
  padding: "1% 4%",
}));

const StyledText = styled(Typography)(() => ({
  lineHeight: 1.2,
  padding: "3%",
  width: "70%",
  inlineSize: "90%",
  // overflowWrap: "break-word",
}));

const ActivityDetailTiles: React.FC<IProps> = ({
  participantsNum,
  dateTime,
  distance,
  price,
}) => {
  // const time = new Date(dateTime?.toString()).getTime()
  return (
    <Box
      sx={{
        width: "90%",
        height: "10px",
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "space-evenly",
      }}
    >
      <StyledBox>
        <IconButton color="primary">
          <PeopleAltIcon sx={{ fontSize: 22 }} />
        </IconButton>
        <StyledText align="center" variant="subtitle1">
          {participantsNum}
        </StyledText>
      </StyledBox>
      <StyledBox>
        <IconButton color="primary">
          <CalendarTodayIcon sx={{ fontSize: 22 }} />
        </IconButton>
        <StyledText align="center" variant="subtitle1">
          {dateTime}
        </StyledText>
      </StyledBox>
      <StyledBox>
        <IconButton color="primary" sx={{ width: "auto" }}>
          <NearMeIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <StyledText align="center" variant="subtitle1">
          {/* {distance} */}
          1.4km
        </StyledText>
      </StyledBox>
      <StyledBox>
        <IconButton color="primary">
          <MonetizationOnIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <StyledText align="center" variant="subtitle1">
          {price}
        </StyledText>
      </StyledBox>
    </Box>
  );
};

export default ActivityDetailTiles;
