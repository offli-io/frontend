import { Box, Typography, useTheme } from "@mui/material";
import shadows from "@mui/material/styles/shadows";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ImagePreviewModal from "components/image-preview-modal/image-preview-modal";
import Loader from "components/loader";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getBuddyState } from "../../api/users/requests";
import userPlaceholder from "../../assets/img/user-placeholder.svg";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import ActionButton from "../../components/action-button";
import OffliButton from "../../components/offli-button";
import { PageWrapper } from "../../components/page-wrapper";
import ProfileStatistics from "../../components/profile-statistics";
import { useGetApiUrl } from "../../hooks/use-get-api-url";
import { useUser } from "../../hooks/use-user";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import { BuddyRequestActionEnum } from "../../types/users/buddy-request-action-enum.dto";
import { BuddyStateEnum } from "../../types/users/buddy-state-enum.dto";
import BuddyButton from "./components/buddies-button";
import LastAttendedActivities from "./components/last-attended-activites";
import ProfileGallery from "./components/profile-gallery/profile-gallery";
import { useSendBuddyRequest } from "./hooks/use-send-buddy-request";
import { useToggleBuddyRequest } from "./hooks/use-toggle-buddy-request";
import { ProfileEntryTypeEnum } from "./types/profile-entry-type";
import { generateBuddyActionButtonLabel } from "./utils/generate-buddy-action-button-label.util";

interface IProfileScreenProps {
  type: ProfileEntryTypeEnum;
}

const ProfileScreen: React.FC<IProfileScreenProps> = ({ type }) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const queryClient = useQueryClient();
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const baseUrl = useGetApiUrl();
  const [previewModalImageUrl, setPreviewModalImageUrl] = React.useState<
    string | null
  >(null);

  const { handleToggleBuddyRequest, isTogglingBuddyRequest } =
    useToggleBuddyRequest({
      onSuccess:
        type === ProfileEntryTypeEnum.REQUEST
          ? undefined
          : () => navigate(ApplicationLocations.BUDDIES),
    });
  const { handleSendBuddyRequest, isSendingBuddyRequest } = useSendBuddyRequest(
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["buddy-state"]);
        queryClient.invalidateQueries(["recommended-buddies"]);
      },
    }
  );

  const { data: { data = {} } = {}, isLoading } = useUser({
    id: id ? Number(id) : userInfo?.id,
    requestingInfoUserId: id ? userInfo?.id : undefined,
  });

  const isBuddy = React.useMemo(
    () => !!data?.buddies?.find(({ id }) => id === userInfo?.id),
    [data]
  );

  const isOtherProfile = React.useMemo(
    () =>
      isBuddy ||
      [
        ProfileEntryTypeEnum.REQUEST,
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
    isFetching: isBuddyStateLoading,
  } = useQuery(
    ["buddy-state", userInfo?.id, id],
    () => getBuddyState(Number(userInfo?.id), Number(id)),
    {
      onError: () => {
        toast.error(`Failed to load activit${id ? "y" : "ies"}`);
      },
      enabled:
        [
          ProfileEntryTypeEnum.REQUEST,
          ProfileEntryTypeEnum.USER_PROFILE,
        ].includes(type) && !!id,
    }
  );

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

  if (isLoading || isBuddyStateLoading) {
    return <Loader />;
  }

  return (
    <>
      <ImagePreviewModal
        imageSrc={`${baseUrl}/files/${previewModalImageUrl}`}
        open={!!previewModalImageUrl}
        onClose={() => setPreviewModalImageUrl(null)}
      />
      <PageWrapper sxOverrides={{ mt: 0 }}>
        <Box
          sx={{
            // height: '20%',
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: 150,
              zIndex: 0,
              position: "relative",
              boxShadow: shadows[2],
            }}
          >
            <img
              src={
                data?.title_photo
                  ? `${baseUrl}/files/${data?.title_photo}`
                  : userPlaceholder
              }
              alt="title"
              style={{ maxHeight: "100%", width: "100%" }}
              onClick={() =>
                !!data?.title_photo &&
                setPreviewModalImageUrl(data?.title_photo)
              }
            />
            {type === ProfileEntryTypeEnum.PROFILE && (
              <BuddyButton buddyCount={data?.buddies_count} />
            )}
          </Box>
          <Box
            sx={{
              zIndex: 1,
              display: "flex",
              mt: -5.5,
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <img
                src={
                  data?.profile_photo
                    ? `${baseUrl}/files/${data?.profile_photo}`
                    : userPlaceholder
                }
                alt="profile"
                style={{
                  height: 100,
                  aspectRatio: 1,
                  borderRadius: "50%",
                  backgroundColor: palette?.background?.default,
                  border: `1px solid ${palette?.primary?.main}`,
                }}
                data-testid="profile-img"
                onClick={() =>
                  !!data?.profile_photo &&
                  setPreviewModalImageUrl(data?.profile_photo)
                }
              />
              <Box sx={{ display: "flex", flexDirection: "column", ml: 1.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "baseline",
                    height: "50%",
                    mt: 6,
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: 250,
                    }}
                  >
                    {data?.username}
                  </Typography>
                  {!!data?.location && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        width: 250,
                      }}
                    >
                      <Typography
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {data?.location?.name}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                mt: 2,
                boxSizing: "border-box",
                px: 2,
              }}
            >
              {data?.about_me}
            </Typography>
          </Box>
        </Box>
        {type === ProfileEntryTypeEnum.PROFILE && (
          <ActionButton
            text="Edit profile"
            sx={{ mt: 2 }}
            onClick={() => navigate(ApplicationLocations.EDIT_PROFILE)}
          />
        )}
        {[
          ProfileEntryTypeEnum.REQUEST,
          ProfileEntryTypeEnum.USER_PROFILE,
        ].includes(type) && !isBuddy ? (
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
        <LastAttendedActivities />

          <Box
            sx={{
              width: "90%",
              mb: 3  
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
              createdNum={
                isBuddy || [ProfileEntryTypeEnum.PROFILE].includes(type)
                  ? data?.activities_created_last_month_count
                  : undefined
              }
              metNum={
                isBuddy || [ProfileEntryTypeEnum.PROFILE].includes(type)
                  ? data?.new_buddies_last_month_count
                  : undefined
              }
              user={data}
              isLoading={isLoading}
            />
          </Box>

        {isOtherProfile && !data?.instagram ? null : (
          <ProfileGallery
            isOtherProfile={isOtherProfile}
            photoUrls={data?.instagram_photos}
            instagramUsername={data?.instagram}
          />
        )}
      </PageWrapper>
    </>
  );
};

export default ProfileScreen;
