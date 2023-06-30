import InstagramIcon from "@mui/icons-material/Instagram";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";

import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { acceptBuddyInvitation } from "../../api/users/requests";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import ActionButton from "../../components/action-button";
import BackHeader from "../../components/back-header";
import OffliButton from "../../components/offli-button";
import { PageWrapper } from "../../components/page-wrapper";
import ProfileGallery from "../../components/profile-gallery";
import ProfileStatistics from "../../components/profile-statistics";
import { useUsers } from "../../hooks/use-users";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { ICustomizedLocationStateDto } from "../../types/common/customized-location-state.dto";
import { IPersonExtended } from "../../types/activities/activity.dto";
import { useUser } from "../../hooks/use-user";
import { ProfileEntryTypeEnum } from "./types/profile-entry-type";
import { generateBackHeaderTitle } from "./utils/profile-screen-utils";
import userPlaceholder from "../../assets/img/user-placeholder.svg";

interface IProfileScreenProps {
  type: ProfileEntryTypeEnum;
}

const ProfileScreen: React.FC<IProfileScreenProps> = ({ type }) => {
  const { userInfo, setUserInfo, setInstagramCode } = React.useContext(
    AuthenticationContext
  );
  const { palette } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location?.state as ICustomizedLocationStateDto)?.from;
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const queryParameters = new URLSearchParams(window.location.search);
  const instagramCode = queryParameters.get("code");
  console.log(instagramCode);

  const { data: { data = {} } = {}, isLoading } = useUser({
    id: id ? Number(id) : userInfo?.id,
  });

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
      {[
        ProfileEntryTypeEnum.REQUEST,
        ProfileEntryTypeEnum.BUDDY,
        ProfileEntryTypeEnum.USER_PROFILE,
      ].includes(type) && (
        <BackHeader
          title={generateBackHeaderTitle(type)}
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
          <Typography
            variant="h4"
            sx={{ mb: 2, color: palette?.text?.primary }}
          >
            {data?.username}
          </Typography>
          <img
            // todo add default picture in case of missing photo
            // src={data?.data?.profilePhotoUrl}
            src={data?.profile_photo_url ?? userPlaceholder}
            alt="profile"
            style={{
              height: "70px",
              width: "70px",
              borderRadius: "50%",
              // backgroundColor: theme?.palette?.inactive as string,
              // border: '2px solid primary.main', //nejde pica
              border: `2px solid ${palette?.primary?.main}`,
              boxShadow: "5px 5px 20px 0px rgba(0,0,0,0.6)",
            }}
            data-testid="profile-img"
          />
          {type !== ProfileEntryTypeEnum.REQUEST && (
            <IconButton
              color="primary"
              sx={{
                backgroundColor: (theme) => theme.palette.primary.light,
                mt: 2,
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
              data-testid="buddies-btn"
            >
              <PeopleAltIcon sx={{ fontSize: 18, padding: 0 }} />
              <Typography
                variant="subtitle1"
                color="primary"
                sx={{
                  fontWeight: "bold",
                  mt: 0.5,
                  ml: 0.75,
                }}
              >
                {`Buddies (${data?.buddies?.length})`}
              </Typography>
            </IconButton>
          )}

          {!!data?.location && (
            <Box
              sx={{
                ml: -1.5,
                display: "flex",
                alignItems: "center",
                my: 1,
                // justifyContent: 'flex-start',
              }}
            >
              <IconButton
                sx={{ paddingRight: 0, color: palette?.text?.primary, mr: 1 }}
              >
                <LocationOnIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <Typography sx={{ color: palette?.text.primary, maxWidth: 250 }}>
                {data?.location?.name}
              </Typography>
            </Box>
          )}
          {!!data?.about_me && (
            <Typography
              // variant="subtitle2"
              // align="center"
              sx={{
                lineHeight: 1.2,
                width: "80%",
                color: palette?.text?.primary,
              }}
            >
              {data?.about_me ??
                "I am student at FIIT STU. I like adventures and meditation. There is always time for a beer. Cheers."}
            </Typography>
          )}
        </Box>
        {type === ProfileEntryTypeEnum.PROFILE && (
          <ActionButton
            text="Edit profile"
            sx={{ mt: 2 }}
            onClick={() => navigate(ApplicationLocations.EDIT_PROFILE)}
          />
        )}
        <Box
          sx={{
            width: "90%",
          }}
        >
          <Typography
            align="left"
            variant="h5"
            sx={{ mt: 3, color: palette?.text?.primary }}
          >
            This month
          </Typography>
          <ProfileStatistics
            participatedNum={data?.activities_participated_last_month_count}
            enjoyedNum={data?.enjoyed_together_last_month_count}
            createdNum={
              type === ProfileEntryTypeEnum.PROFILE
                ? data?.activities_created_last_month_count
                : undefined
            }
            metNum={
              type === ProfileEntryTypeEnum.PROFILE
                ? data?.new_buddies_last_month_count
                : undefined
            }
            isLoading={isLoading}
          />
        </Box>

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
            <Typography
              align="left"
              variant="h5"
              sx={{ color: palette?.text?.primary }}
            >
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
