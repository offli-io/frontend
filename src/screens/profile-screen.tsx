import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import InstagramIcon from "@mui/icons-material/Instagram";

import { PageWrapper } from "../components/page-wrapper";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProfileGallery from "../components/profile-gallery";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import { getUsers } from "../api/activities/requests";
import ProfilePicture from "../assets/img/profilePicture.jpg";
import ProfileStatistics from "../components/profile-statistics";
import BackHeader from "../components/back-header";
import { ICustomizedLocationStateDto } from "../types/common/customized-location-state.dto";
import OffliButton from "../components/offli-button";
import { useSnackbar } from "notistack";
import { acceptBuddyInvitation } from "../api/users/requests";
import ActionButton from "../components/action-button";

interface IProfileScreenProps {
  type: "profile" | "request" | "buddy";
}

const ProfileScreen: React.FC<IProfileScreenProps> = ({ type }) => {
  const { userInfo, setUserInfo, setInstagramCode } = React.useContext(
    AuthenticationContext
  );
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location?.state as ICustomizedLocationStateDto)?.from;
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const queryParameters = new URLSearchParams(window.location.search);
  const instagramCode = queryParameters.get("code");
  console.log(instagramCode);

  const { data, isLoading } = useQuery(
    ["user-info", userInfo?.username, id],
    () => getUsers({ username: id ? undefined : userInfo?.username, id }),
    {
      enabled: !!userInfo?.username,
      onSuccess: (data) => {
        setUserInfo && !id && setUserInfo(data?.data);
      },
    }
  );

  const { mutate: sendAcceptBuddyRequest } = useMutation(
    ["accept-buddy-request"],
    () => acceptBuddyInvitation(userInfo?.id, id),
    {
      onSuccess: (data, variables) => {
        //TODO what to invalidate, and where to navigate after success
        // queryClient.invalidateQueries(['notifications'])
        // navigateBasedOnType(
        //   variables?.type,
        //   variables?.properties?.user?.id ?? variables?.properties?.activity?.id
        // )
        enqueueSnackbar("User was successfully confirmed as your buddy", {
          variant: "success",
        });
      },
      onError: () => {
        enqueueSnackbar("Failed to accept buddy request", {
          variant: "error",
        });
      },
    }
  );

  React.useEffect(() => {
    if (instagramCode) {
      setInstagramCode(instagramCode);
    }
  }, [instagramCode, setInstagramCode]);

  const handleIGAuthorize = () => {
    window.location.href =
      "https://api.instagram.com/oauth/authorize?client_id=738841197888411&redirect_uri=https://localhost:3000/profile/&scope=user_profile,user_media&response_type=code";
  };

  // redirect URI should be proper offli address that should read instagram code
  // https://api.instagram.com/oauth/authorize
  // ?client_id=738841197888411
  // &redirect_uri=https://terapartners.sk/
  // &scope=user_profile,user_media
  // &response_type=code

  return null;
  //     {(type === "request" || type === "buddy") && (
  //       <BackHeader
  //         title={type === "request" ? "Buddie request" : "Buddy"}
  //         sx={{ mb: 2 }}
  //         to={from}
  //       />
  //     )}
  //     <PageWrapper>
  //       <Box
  //         sx={{
  //           // height: '20%',
  //           width: "90%",
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "center",
  //           flexDirection: "column",
  //         }}
  //       >
  //         <Typography variant="h4" sx={{ mb: 0.5 }}>
  //           {data?.data?.username}
  //         </Typography>
  //         <img
  //           // todo add default picture in case of missing photo
  //           // src={data?.data?.profilePhotoUrl}
  //           src={data?.data?.profile_photo_url}
  //           alt="profile"
  //           style={{
  //             height: "70px",
  //             width: "70px",
  //             borderRadius: "50%",
  //             // border: '2px solid primary.main', //nejde pica
  //             border: "2px solid black",
  //           }}
  //         />
  //         <Box
  //           sx={{
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "center",
  //             // mt: 0.2,
  //           }}
  //         >
  //           <OffliButton
  //             startIcon={<PeopleAltIcon sx={{ fontSize: 18, padding: 0 }} />}
  //             onClick={() =>
  //               navigate(ApplicationLocations.BUDDIES, {
  //                 state: {
  //                   from: ApplicationLocations.PROFILE,
  //                 },
  //               })
  //             }
  //             sx={{
  //               bgcolor: (theme) => theme.palette.primary.light,
  //               color: (theme) => theme.palette.primary.main,
  //               py: 0,
  //               mt: 1.5,
  //               mb: 1,
  //             }}
  //           >
  //             {String(data?.data?.buddies?.length) ?? "0"}
  //           </OffliButton>

  //       <Box
  //         sx={{
  //           width: "90%",
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "space-between",
  //           mb: 1,
  //         }}
  //       >
  //         <Box sx={{ mt: 3 }}>
  //           <Typography align="left" variant="h5">
  //             Photos
  //           </Typography>
  //         </Box>
  //         <Box
  //           sx={{
  //             display: "flex",
  //             alignItems: "flex-end",
  //             justifyContent: "center",
  //           }}
  //         >
  //           <IconButton color="primary" sx={{ padding: 0 }}>
  //             <InstagramIcon />
  //           </IconButton>
  //           <Typography
  //             align="left"
  //             variant="subtitle1"
  //             sx={{ ml: 0.5, mt: 3, color: "primary.main", fontWeight: "bold" }}
  //           >
  //             {data?.data.username}
  //           </Typography>
  //         </Box>
  //       </Box>
  //       <ProfileGallery />
  //       <OffliButton onClick={handleIGAuthorize}>Authorize ig</OffliButton>
  //     </PageWrapper>

  // )
};

export default ProfileScreen;
