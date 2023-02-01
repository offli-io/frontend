import React from "react";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

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
  return (
    <Grid
      container
      rowSpacing={1}
      sx={{
        width: "100%",
        borderRadius: "15px",
        backgroundColor: "#E4E3FF",
        paddingBottom: "5%",
        marginTop: "1%",
      }}
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
          {participatedNum && (
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  // padding: '5%',
                }}
              >
                <IconButton color="primary">
                  <OfflineBoltIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <Typography
                  align="center"
                  variant="subtitle2"
                  sx={{ lineHeight: 1.2 }}
                >
                  You participated in <br />{" "}
                  <b>{participatedNum} activities!</b>
                </Typography>
              </Box>
            </Grid>
          )}
          {enjoyedNum && (
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  // padding: '5%',
                }}
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
          )}
          {createdNum && (
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  // padding: '5%',
                }}
              >
                <IconButton color="primary" sx={{ padding: "2%" }}>
                  <AddRoundedIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <Typography
                  align="center"
                  variant="subtitle2"
                  sx={{ lineHeight: 1.2 }}
                >
                  You created <br />
                  <b>{createdNum} activities.</b>
                </Typography>
              </Box>
            </Grid>
          )}
          {metNum && (
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  // padding: '5%',
                }}
              >
                <IconButton color="primary">
                  <PeopleAltIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <Typography
                  align="center"
                  variant="subtitle2"
                  sx={{ lineHeight: 1.2 }}
                >
                  You`ve met <br />
                  <b>{metNum} new buddies!</b>
                </Typography>
              </Box>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export default ProfileStatistics;
