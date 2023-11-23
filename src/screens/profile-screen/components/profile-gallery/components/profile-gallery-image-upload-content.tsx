import {
  Box,
  Chip,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import shadows from "@mui/material/styles/shadows";
import OffliButton from "components/offli-button";
import { useGetApiUrl } from "hooks/use-get-api-url";
import { usePredefinedPictures } from "hooks/use-predefined-pictures";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectInstagram, fetchInstagramPhotos } from "api/users/requests";
import { AuthenticationContext } from "assets/theme/authentication-provider";
import { toast } from "sonner";
import { DrawerContext } from "assets/theme/drawer-provider";
import Loader from "components/loader";

interface IProfileGalleryImageUploadContentProps {
  //   imageUrls?: string[];
  instagramCode?: string;
  tags?: string[];
}

interface IImageSubmitState {
  image?: string;
  state?: "success" | "fail";
}

const ProfileGalleryImageUploadContent: React.FC<
  IProfileGalleryImageUploadContentProps
> = ({ tags, instagramCode }) => {
  const baseUrl = useGetApiUrl();
  const [selectedPhotos, setSelectedPhotos] = React.useState<string[]>([]);
  const [imageSubmitStates, setImageSubmitStates] = React.useState<
    IImageSubmitState[] | null
  >(null);
  const { palette } = useTheme();
  const { toggleDrawer } = React.useContext(DrawerContext);
  const queryClient = useQueryClient();

  const { userInfo } = React.useContext(AuthenticationContext);

  const {
    data: { data: { media: instagramPhotos = [] } = {} } = {},
    isLoading: areInstagramPhotosLoading,
    mutate: sendFetchInstagramPhotos,
  } = useMutation(
    ["instagram-photos"],
    (code?: string) => fetchInstagramPhotos(Number(userInfo?.id), String(code)),
    {
      onError: () => {
        toast.error("Failed to fetch instagram photos");
        toggleDrawer({ open: false });
      },
    }
  );

  const {
    isLoading: areInstagramPhotosUploading,
    mutate: sendUpdateInstagramPhotos,
  } = useMutation(
    ["instagram-photos-submit"],
    (photoUrls?: string[]) => connectInstagram(Number(userInfo?.id), photoUrls),
    {
      onSuccess: () => {
        toggleDrawer({ open: false });
        toast.success("Your instagram account has been successfully connected");
        queryClient.invalidateQueries(["user"]);
        //didnt even notice the refresh -> this might work
        window.history.pushState({}, document.title, window.location.pathname);
      },
      onError: () => {
        toast.error("Failed to upload instagram photos");
        // toggleDrawer({ open: false });
        // window.history.pushState(
        //   {},
        //   document.title,
        //   window.location.pathname
        // );
      },
    }
  );

  React.useEffect(() => {
    if (!!instagramCode) {
      sendFetchInstagramPhotos(instagramCode);
    }
  }, [instagramCode]);

  const handlePhotoSelect = React.useCallback(
    (image: string) => {
      if (selectedPhotos?.includes(image)) {
        setSelectedPhotos((selectedPhotos) =>
          selectedPhotos?.filter((item) => item !== image)
        );
      } else {
        setSelectedPhotos((selectedPhotos) => [...selectedPhotos, image]);
      }
    },
    [selectedPhotos]
  );

  const handleSubmitPhotos = React.useCallback(() => {
    sendUpdateInstagramPhotos(selectedPhotos);
  }, [selectedPhotos, sendUpdateInstagramPhotos]);

  const isImageSelected = React.useCallback(
    (image: string) => selectedPhotos?.some((photo) => photo === image),
    [selectedPhotos]
  );
  return (
    <Box sx={{ maxHeight: 300 }}>
      {areInstagramPhotosLoading ? (
        <Loader />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: 2,
            my: 2,
          }}
        >
          {instagramPhotos?.map((photoUrl, index) => (
            <Box key={photoUrl} sx={{ position: "relative" }}>
              <img
                src={photoUrl}
                alt="gallery"
                style={{
                  maxWidth: 100,
                  //TODO if we don't want to crop the photos
                  height: "100%",
                  objectFit: "cover",
                  alignSelf: "center",
                  boxShadow: isImageSelected(photoUrl)
                    ? shadows[5]
                    : shadows[0],
                  border: isImageSelected(photoUrl)
                    ? `2px solid ${palette?.primary?.main}`
                    : "2px solid transparent",
                  opacity: isImageSelected(photoUrl) ? 0.6 : 1,
                }}
                key={`predefined_picture_${photoUrl}`}
                data-testid="offli-gallery-img-btn"
                onClick={() => handlePhotoSelect(photoUrl)}
              />
              {isImageSelected(photoUrl) ? (
                <CheckCircleRoundedIcon
                  sx={{
                    color: "primary.main",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ) : null}
            </Box>
          ))}
        </Box>
      )}
      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "center", mt: 4 }}
      >
        <OffliButton
          onClick={handleSubmitPhotos}
        >{`Submit photos`}</OffliButton>
      </Box>
    </Box>
  );
};

export default ProfileGalleryImageUploadContent;
