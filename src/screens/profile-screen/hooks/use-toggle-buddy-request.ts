import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toggleBuddyInvitation } from "../../../api/users/requests";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import { ICustomizedLocationStateDto } from "../../../types/common/customized-location-state.dto";
import { BuddyRequestActionEnum } from "../../../types/users/buddy-request-action-enum.dto";

interface IToggleBuddyRequestValues {
  status?: BuddyRequestActionEnum;
  buddyToBeId?: number;
}

interface IUseToggleBuddyRequestProps {
  onSuccess?: () => void;
}

export const useToggleBuddyRequest = ({
  onSuccess,
}: IUseToggleBuddyRequestProps = {}) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const { userInfo } = React.useContext(AuthenticationContext);
  const location = useLocation();
  const from = (location?.state as ICustomizedLocationStateDto)?.from;
  const notificationId = (
    location?.state as ICustomizedLocationStateDto & { notificationId?: number }
  )?.notificationId;

  const navigate = useNavigate();

  const { mutate: sendToggleBuddyRequest, isLoading: isTogglingBuddyRequest } =
    useMutation(
      (values: IToggleBuddyRequestValues) => {
        abortControllerRef.current = new AbortController();

        return toggleBuddyInvitation(
          userInfo?.id,
          values?.buddyToBeId,
          values?.status
          //   abortControllerRef.current.signal
        );
      },
      {
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries(["buddies"]);
          queryClient.invalidateQueries(["buddy-state"]);

          if (variables?.status === BuddyRequestActionEnum.CONFIRM) {
            enqueueSnackbar("You have successfully added user as your buddy", {
              variant: "success",
            });
          }

          if (variables?.status === BuddyRequestActionEnum.REJECT) {
            enqueueSnackbar("You have successfully declined buddy request", {
              variant: "success",
            });
          }
          onSuccess?.();
        },
        onError: (error, variables) => {
          enqueueSnackbar(
            variables?.status === BuddyRequestActionEnum.CONFIRM
              ? "Failed to add user as your buddy"
              : "Failed to decline buddy request",
            {
              variant: "error",
            }
          );
        },
      }
    );
  const handleToggleBuddyRequest = React.useCallback(
    (values: IToggleBuddyRequestValues) => {
      sendToggleBuddyRequest(values);
    },
    [sendToggleBuddyRequest]
  );

  return { handleToggleBuddyRequest, isTogglingBuddyRequest };
};
