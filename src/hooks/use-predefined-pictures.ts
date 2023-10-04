import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  getPredefinedPhotos,
  getPredefinedTags,
} from "../api/activities/requests";

export interface IUsePredefinedPicturesReturn {
  tags?: string[];
}

export const usePredefinedPictures = ({
  tags,
}: IUsePredefinedPicturesReturn = {}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery(
    ["predefined-photos", tags],
    () => getPredefinedPhotos(tags),
    {
      onError: () => {
        //some generic toast for every hook
        enqueueSnackbar("Failed to load predefined pictures", {
          variant: "error",
        });
      },
    }
  );

  return { data, isLoading };
};
