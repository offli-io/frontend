import InstagramIcon from "@mui/icons-material/Instagram";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { connectInstagram, getBuddyState } from "../../api/users/requests";
import userPlaceholder from "../../assets/img/user-placeholder.svg";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import ActionButton from "../../components/action-button";
import { PageWrapper } from "../../components/page-wrapper";
import ProfileGallery from "../../components/profile-gallery";
import ProfileStatistics from "../../components/profile-statistics";
import { useUser } from "../../hooks/use-user";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { ICustomizedLocationStateDto } from "../../types/common/customized-location-state.dto";
import { ProfileEntryTypeEnum } from "./types/profile-entry-type";
import OffliButton from "../../components/offli-button";
import { useToggleBuddyRequest } from "./hooks/use-toggle-buddy-request";
import { BuddyRequestActionEnum } from "../../types/users/buddy-request-action-enum.dto";
import { deleteNotification } from "../../api/notifications/requests";
import { useGetApiUrl } from "../../hooks/use-get-api-url";
import { useSendBuddyRequest } from "./hooks/use-send-buddy-request";
import { BuddyStateEnum } from "../../types/users/buddy-state-enum.dto";
import { generateBuddyActionButtonLabel } from "./utils/generate-buddy-action-button-label.util";

interface IProfileScreenProps {
  type: ProfileEntryTypeEnum;
}

const ProfileScreen: React.FC<IProfileScreenProps> = ({ type }) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();
  const { palette } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location?.state as ICustomizedLocationStateDto)?.from;
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const queryParameters = new URLSearchParams(window.location.search);
  const instagramCode = queryParameters.get("code");
  const baseUrl = useGetApiUrl();

  const { handleToggleBuddyRequest, isTogglingBuddyRequest } =
    useToggleBuddyRequest({
      onSuccess:
        type === ProfileEntryTypeEnum.REQUEST
          ? undefined
          : () => navigate(ApplicationLocations.BUDDIES),
    });
  const { handleSendBuddyRequest, isSendingBuddyRequest } = useSendBuddyRequest(
    { onSuccess: () => queryClient.invalidateQueries(["buddy-state"]) }
  );

  const { data: { data = {} } = {}, isLoading } = useUser({
    id: id ? Number(id) : userInfo?.id,
    requestingInfoUserId: id ? userInfo?.id : undefined,
  });

  const { isLoading: isConnectingInstagram, mutate: sendConnectInstagram } =
    useMutation(
      ["instagram-connection"],
      (code?: string) => connectInstagram(Number(userInfo?.id), String(code)),
      {
        onSuccess: () => {
          //params destruction
          // const url = new URL(window.location.href);
          // url.searchParams.delete
          //this doesn't work -> will have to redirect I guess
          enqueueSnackbar(
            "Your instagram account has been successfully connected",
            { variant: "success" }
          );
          queryClient.invalidateQueries(["user"]);
          //didnt even notice the refresh -> this might work
          window.history.pushState(
            {},
            document.title,
            window.location.pathname
          );
        },
        onError: () => {
          enqueueSnackbar("Failed to connect your instagram account", {
            variant: "error",
          });
        },
      }
    );

  const isOtherProfile = React.useMemo(
    () =>
      [
        ProfileEntryTypeEnum.REQUEST,
        ProfileEntryTypeEnum.BUDDY,
        ProfileEntryTypeEnum.USER_PROFILE,
      ].includes(type),
    [type]
  );

  const {
    data: {
      data: {
        state: buddyState = null,
        senderId = null,
        receiverId = null,
      } = {},
    } = {},
    isLoading: isBuddyStateLoading,
  } = useQuery(
    ["buddy-state", userInfo?.id, id],
    () => getBuddyState(Number(userInfo?.id), Number(id)),
    {
      onError: () => {
        //some generic toast for every hook
        enqueueSnackbar(`Failed to load activit${id ? "y" : "ies"}`, {
          variant: "error",
        });
      },
      enabled:
        [
          ProfileEntryTypeEnum.REQUEST,
          ProfileEntryTypeEnum.USER_PROFILE,
        ].includes(type) && !!id,
    }
  );

  React.useEffect(() => {
    if (instagramCode && userInfo?.id) {
      sendConnectInstagram(instagramCode);
    }
  }, [instagramCode, userInfo?.id]);

  const onBuddyRequestAccept = React.useCallback(() => {
    handleToggleBuddyRequest({
      buddyToBeId: Number(id),
      status: BuddyRequestActionEnum.CONFIRM,
    });
  }, [handleToggleBuddyRequest, id]);

  const onBuddyRequestDecline = React.useCallback(() => {
    handleToggleBuddyRequest({
      buddyToBeId: Number(id),
      status: BuddyRequestActionEnum.REJECT,
    });
  }, [handleToggleBuddyRequest, id]);

  const displayStatistics = React.useMemo(() => {
    return (
      (data?.enjoyed_together_last_month_count ?? 0) > 0 ||
      (data?.activities_created_last_month_count ?? 0) ||
      (data?.activities_participated_last_month_count ?? 0) ||
      (data?.new_buddies_last_month_count ?? 0) > 0
    );
  }, [data]);

  const handleBuddyRequest = React.useCallback(() => {
    // don't need to check sender id because when I have already sent buddy request button is disabled
    if (buddyState === BuddyStateEnum.PENDING) {
      return onBuddyRequestAccept();
    }

    handleSendBuddyRequest(Number(id));
  }, [buddyState, onBuddyRequestAccept, handleSendBuddyRequest]);

  const actionButtonDisabled = React.useMemo(
    () =>
      // buddy request sent by you
      (buddyState === BuddyStateEnum.PENDING && senderId === userInfo?.id) ||
      //or declined buddy request
      buddyState === BuddyStateEnum.BLOCKED ||
      buddyState === BuddyStateEnum.CONFIRMED,
    [buddyState, senderId, userInfo?.id]
  );

  return (
    <>
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
            src={
              data?.profile_photo
                ? `${baseUrl}/files/${data?.profile_photo}`
                : userPlaceholder
            }
            alt="profile"
            style={{
              height: 90,
              aspectRatio: 1,
              borderRadius: "50%",
              // backgroundColor: theme?.palette?.inactive as string,
              // border: '2px solid primary.main', //nejde pica
              border: `2px solid ${palette?.primary?.main}`,
              boxShadow: "5px 5px 20px 0px rgba(0,0,0,0.6)",
            }}
            data-testid="profile-img"
          />
          {type === ProfileEntryTypeEnum.PROFILE && (
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
              {data?.about_me}
            </Typography>
          )}
        </Box>
        {type === ProfileEntryTypeEnum.PROFILE && (
          <ActionButton
            text="Edit profile"
            sx={{ mt: 2 }}
            onClick={() =>
              navigate(ApplicationLocations.EDIT_PROFILE, {
                state: {
                  from: ApplicationLocations.PROFILE,
                },
              })
            }
          />
        )}
        {[
          ProfileEntryTypeEnum.REQUEST,
          ProfileEntryTypeEnum.USER_PROFILE,
        ].includes(type) ? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              mt: 2.5,
            }}
          >
            <OffliButton
              color={
                buddyState === BuddyStateEnum.BLOCKED ? "error" : "primary"
              }
              sx={{ fontSize: 14, width: "45%", mr: 2 }}
              onClick={handleBuddyRequest}
              isLoading={isTogglingBuddyRequest}
              disabled={actionButtonDisabled}
            >
              {generateBuddyActionButtonLabel(
                buddyState,
                userInfo?.id,
                senderId
              )}
            </OffliButton>
            {receiverId === userInfo?.id &&
            buddyState === BuddyStateEnum.PENDING ? (
              <OffliButton
                sx={{ fontSize: 14, px: 3 }}
                variant="outlined"
                onClick={onBuddyRequestDecline}
                isLoading={isTogglingBuddyRequest}
              >
                Decline
              </OffliButton>
            ) : null}
          </Box>
        ) : null}
        {/* {type === ProfileEntryTypeEnum.USER_PROFILE ? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              mt: 2.5,
            }}
          >
            <OffliButton
              sx={{ fontSize: 14, width: "50%" }}
              onClick={handleBuddyRequest}
              isLoading={isTogglingBuddyRequest}
              disabled={
                buddyState === BuddyStateEnum.PENDING &&
                senderId === userInfo?.id
              }
            >
              {generateBuddyActionButtonLabel(
                buddyState,
                userInfo?.id,
                senderId
              )}
            </OffliButton>
          </Box>
        ) : null} */}
        {displayStatistics ? (
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
                [
                  ProfileEntryTypeEnum.BUDDY,
                  ProfileEntryTypeEnum.PROFILE,
                ].includes(type)
                  ? data?.activities_created_last_month_count
                  : undefined
              }
              metNum={
                [
                  ProfileEntryTypeEnum.BUDDY,
                  ProfileEntryTypeEnum.PROFILE,
                ].includes(type)
                  ? data?.new_buddies_last_month_count
                  : undefined
              }
              isLoading={isLoading}
            />
          </Box>
        ) : null}

        {data?.instagram ? (
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
                sx={{
                  ml: 0.5,
                  mt: 3,
                  color: "primary.main",
                  fontWeight: "bold",
                }}
              >
                {data?.instagram}
              </Typography>
            </Box>
          </Box>
        ) : null}

        <ProfileGallery
          isOtherProfile={isOtherProfile}
          photoUrls={data?.instagram_photos}
        />
      </PageWrapper>
    </>
  );
};

export default ProfileScreen;
