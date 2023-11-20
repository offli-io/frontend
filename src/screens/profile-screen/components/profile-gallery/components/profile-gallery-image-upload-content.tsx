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
import { useMutation } from "@tanstack/react-query";
import { connectInstagram, fetchInstagramPhotos } from "api/users/requests";
import { AuthenticationContext } from "assets/theme/authentication-provider";
import { toast } from "sonner";
import { DrawerContext } from "assets/theme/drawer-provider";

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

  const { userInfo } = React.useContext(AuthenticationContext);

  const imageUrls = [
    "54d86ed0-0cb7-4b7a-9bcf-c083b1a700d0.jpeg",
    "99155a39-d029-4d83-8415-97e3d91960aa.jpeg",
    "0c4174ae-73f7-43e9-93da-c8196844859a.jpeg",
    "f149570a-e945-4c50-972d-b667a499a5cb.jpeg",
  ];

  const {
    data: { data: instagramPhotos = [] } = {},
    isLoading: isConnectingInstagram,
    mutate: sendFetchInstagramPhotos,
  } = useMutation(
    ["instagram-photos"],
    (code?: string) => fetchInstagramPhotos(Number(userInfo?.id), String(code)),
    {
      //   onSuccess: () => {
      //     // toast.success(
      //     //   "Your instagram account has been successfully connected"
      //     // );
      //     queryClient.invalidateQueries(["user"]);
      //     //didnt even notice the refresh -> this might work
      //     window.history.pushState(
      //       {},
      //       document.title,
      //       window.location.pathname
      //     );
      //   },
      onError: () => {
        toast.error("Failed to fetch instagram photos");
        toggleDrawer({ open: false });
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
    console.log(selectedPhotos);
  }, [selectedPhotos]);

  const isImageSelected = React.useCallback(
    (image: string) => selectedPhotos?.some((photo) => photo === image),
    [selectedPhotos]
  );
  return (
    <Box>
      {/* {isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : count > 0 ? ( */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gap: 2,
          my: 2,
        }}
      >
        {instagramPhotos.map((image, index) => (
          <Box sx={{ position: "relative" }}>
            <img
              src={`${baseUrl}/files/${image}`}
              alt="gallery"
              style={{
                maxWidth: 100,
                //TODO if we don't want to crop the photos
                height: "100%",
                objectFit: "cover",
                alignSelf: "center",
                boxShadow: isImageSelected(image) ? shadows[5] : shadows[2],
                border: isImageSelected(image)
                  ? `2px solid ${palette?.primary?.main}`
                  : "unset",
                opacity: isImageSelected(image) ? 0.6 : 1,
              }}
              key={`predefined_picture_${image}`}
              data-testid="offli-gallery-img-btn"
              onClick={() => handlePhotoSelect(image)}
            />
            {isImageSelected(image) ? (
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
      {/* ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            my: 2,
          }}
        >
          <Typography sx={{ color: (theme) => theme?.palette?.text?.primary }}>
            There are no available pre-defined pictures
          </Typography>
        </Box>
      )}
      
      */}
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
