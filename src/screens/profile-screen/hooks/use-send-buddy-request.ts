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

interface IUseSendBuddyRequestProps {
  onSuccess?: () => void;
}

export const useSendBuddyRequest = ({
  onSuccess,
}: IUseSendBuddyRequestProps = {}) => {
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
          enqueueSnackbar("Buddy request successfully sent", {
            variant: "success",
          });
          if (!!onSuccess) {
            onSuccess?.();
          } else {
            navigate(from as To);
          }
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
