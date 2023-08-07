import { useSnackbar } from "notistack";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleBuddyInvitation } from "../../../api/users/requests";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import { BuddyRequestActionEnum } from "../../../types/users/buddy-request-action-enum.dto";
import { To, useLocation, useNavigate, useParams } from "react-router-dom";
import { ICustomizedLocationStateDto } from "../../../types/common/customized-location-state.dto";
import { deleteNotification } from "../../../api/notifications/requests";
import { sendBuddyRequest } from "../../../api/activities/requests";

interface IToggleBuddyRequestValues {
  status?: BuddyRequestActionEnum;
  buddyToBeId?: number;
}

export const useSendBuddyRequest = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const { userInfo } = React.useContext(AuthenticationContext);
  const location = useLocation();
  const from = (location?.state as ICustomizedLocationStateDto)?.from;
  const { id } = useParams();

  const navigate = useNavigate();

  const { mutate: sendSubmitBuddyRequest, isLoading: isSendingBuddyRequest } =
    useMutation(
      ["send-buddy-request"],
      (userId?: number) => sendBuddyRequest(userInfo?.id, Number(userId)),
      {
        onSuccess: (data, variables) => {
          //TODO what to invalidate, and where to navigate after success
          // queryClient.invalidateQueries(['notifications'])
          // navigateBasedOnType(
          //   variables?.type,
          //   variables?.properties?.user?.id ?? variables?.properties?.activity?.id
          // )
          // queryClient.invalidateQueries(["notifications"]);
          enqueueSnackbar("Buddy request successfully sent", {
            variant: "success",
          });
          navigate(from as To);
        },
        onError: () => {
          enqueueSnackbar("Failed to send buddy request", {
            variant: "error",
          });
        },
      }
    );

  const handleSendBuddyRequest = React.useCallback(
    (userId?: number) => {
      sendSubmitBuddyRequest(userId);
    },
    [sendSubmitBuddyRequest]
  );

  return { handleSendBuddyRequest, isSendingBuddyRequest };
};
