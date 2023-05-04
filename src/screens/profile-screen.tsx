import InstagramIcon from "@mui/icons-material/Instagram";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";

import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { acceptBuddyInvitation } from "../api/users/requests";
import { AuthenticationContext } from "../assets/theme/authentication-provider";
import ActionButton from "../components/action-button";
import BackHeader from "../components/back-header";
import OffliButton from "../components/offli-button";
import { PageWrapper } from "../components/page-wrapper";
import ProfileGallery from "../components/profile-gallery";
import ProfileStatistics from "../components/profile-statistics";
import { useUsers } from "../hooks/use-users";
import { ApplicationLocations } from "../types/common/applications-locations.dto";
import { ICustomizedLocationStateDto } from "../types/common/customized-location-state.dto";
import { IPersonExtended } from "../types/activities/activity.dto";

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

  const { data, isLoading } = useUsers<IPersonExtended>({
    id: userInfo?.id,
  });

  console.log(data);

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

  return (
    <>
      {(type === "request" || type === "buddy") && (
        <BackHeader
          title={type === "request" ? "Buddie request" : "Buddy"}
          sx={{ mb: 2 }}
          to={from}
        />
      )}
      <PageWrapper>
        <Box
          sx={{
            // height: '20%',
            width: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            {data?.username}
          </Typography>
          <img
            // todo add default picture in case of missing photo
            // src={data?.data?.profilePhotoUrl}
            src={data?.profile_photo_url}
            alt="profile"
            style={{
              height: "70px",
              width: "70px",
              borderRadius: "50%",
              // border: '2px solid primary.main', //nejde pica
              border: "2px solid black",
            }}
          />
          {type !== "request" && (
            <IconButton
              color="primary"
              sx={{
                backgroundColor: (theme) => theme.palette.primary.light,
                mt: 1,
                px: 2.5,
                py: 0.5,
                borderRadius: "15px",
              }}
              onClick={() =>
                navigate(ApplicationLocations.BUDDIES, {
                  state: {
                    from: ApplicationLocations.PROFILE,
                  },
                })
              }
            >
              <PeopleAltIcon sx={{ fontSize: 18, padding: 0 }} />
              <Typography
                variant="subtitle1"
                color="primary"
                sx={{
                  fontWeight: "bold",
                  mt: 0.5,
                  ml: 0.5,
                }}
              >
                {data?.buddies?.length}
              </Typography>
            </IconButton>
          )}

          <Box
            sx={{
              ml: -1.5,
              display: "flex",
              alignItems: "center",
              // justifyContent: 'flex-start',
            }}
          >
            <IconButton sx={{ paddingRight: 0, color: "black" }}>
              <LocationOnIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography variant="subtitle2">Bratislava, Slovakia</Typography>
          </Box>
          <Typography
            variant="subtitle2"
            // align="center"
            sx={{ lineHeight: 1.2, width: "80%" }}
          >
            {data?.about_me ??
              "I am student at FIIT STU. I like adventures and meditation. There is always time for a beer. Cheers."}
          </Typography>
        </Box>
        {type === "profile" && (
          <ActionButton
            text="Edit profile"
            sx={{ mt: 2 }}
            // href={ApplicationLocations.EDIT_PROFILE}
            onClick={() => navigate(ApplicationLocations.EDIT_PROFILE)}
          />
        )}
        <Box
          sx={{
            width: "90%",
          }}
        >
          <Typography align="left" variant="h5" sx={{ mt: 3 }}>
            This month
          </Typography>
          <ProfileStatistics
            participatedNum={data?.activities_participated_last_month_count}
            enjoyedNum={data?.enjoyed_together_last_month_count}
            createdNum={
              type === "profile"
                ? data?.activities_created_last_month_count
                : undefined
            }
            metNum={
              type === "profile"
                ? data?.new_buddies_last_month_count
                : undefined
            }
            isLoading={isLoading}
          />
        </Box>
        {/* {type === "request" && (
          <OffliButton
            sx={{ fontSize: 16, px: 2.5, mt: 2 }}
            onClick={sendAcceptBuddyRequest}
          >
            Accept buddie request
          </OffliButton>
        )} */}
        <Box
          sx={{
            width: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ mt: 3 }}>
            <Typography align="left" variant="h5">
              Photos
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <IconButton color="primary" sx={{ padding: 0 }}>
              <InstagramIcon />
            </IconButton>
            <Typography
              align="left"
              variant="subtitle1"
              sx={{ ml: 0.5, mt: 3, color: "primary.main", fontWeight: "bold" }}
            >
              {data?.username}
            </Typography>
          </Box>
        </Box>
        <ProfileGallery />
        <OffliButton onClick={handleIGAuthorize}>Authorize ig</OffliButton>
      </PageWrapper>
    </>
  );
};

export default ProfileScreen;
