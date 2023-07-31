import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";

interface IProps {
  participatedNum?: number;
  enjoyedNum?: number;
  createdNum?: number;
  metNum?: number;
  isLoading?: boolean;
}

const ProfileStatistics: React.FC<IProps> = ({
  participatedNum,
  enjoyedNum,
  createdNum,
  metNum,
  isLoading,
}) => {
  const { id } = useParams();
  return (
    <Grid
      container
      rowSpacing={1}
      sx={{
        width: "100%",
        borderRadius: "15px",
        // backgroundColor: "#E4E3FF",
        paddingBottom: "5%",
        marginTop: "1%",
      }}
      data-testid="profile-statistics-grid"
    >
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: 2,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {participatedNum ? (
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
                data-testid="participated-statistics"
              >
                <IconButton color="primary">
                  <OfflineBoltIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <Typography
                  align="center"
                  variant="subtitle2"
                  sx={{ lineHeight: 1.2 }}
                >
                  {!!id ? "Participated " : "You participated "}
                  in <br /> <b>{participatedNum} activities!</b>
                </Typography>
              </Box>
            </Grid>
          ) : null}
          {enjoyedNum ? (
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
                data-testid="enjoyed-statistics"
              >
                <IconButton color="primary">
                  <FavoriteIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <Typography
                  align="center"
                  variant="subtitle2"
                  sx={{ lineHeight: 1.2 }}
                >
                  <b>{enjoyedNum} times</b> enjoyed <br /> time together!
                </Typography>
              </Box>
            </Grid>
          ) : null}
          {createdNum ? (
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
                data-testid="created-statistics"
              >
                <IconButton color="primary" sx={{ padding: "2%" }}>
                  <AddRoundedIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <Typography
                  align="center"
                  variant="subtitle2"
                  sx={{ lineHeight: 1.2 }}
                >
                  {!!id ? "Created " : "You created "} <br />
                  <b>{createdNum} activities.</b>
                </Typography>
              </Box>
            </Grid>
          ) : null}
          {metNum ? (
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
                data-testid="new-buddies-statistics"
              >
                <IconButton color="primary">
                  <PeopleAltIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <Typography
                  align="center"
                  variant="subtitle2"
                  sx={{ lineHeight: 1.2 }}
                >
                  {!!id ? "Met " : "You`ve met "}
                  <br />
                  <b>{metNum} new buddies!</b>
                </Typography>
              </Box>
            </Grid>
          ) : null}
        </>
      )}
    </Grid>
  );
};

export default ProfileStatistics;
