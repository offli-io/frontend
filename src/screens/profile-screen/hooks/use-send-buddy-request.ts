import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { To, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { sendBuddyRequest } from "../../../api/activities/requests";
import { AuthenticationContext } from "../../../assets/theme/authentication-provider";
import { ICustomizedLocationStateDto } from "../../../types/common/customized-location-state.dto";

interface IUseSendBuddyRequestProps {
  onSuccess?: () => void;
}

export const useSendBuddyRequest = ({
  onSuccess,
}: IUseSendBuddyRequestProps = {}) => {
  const queryClient = useQueryClient();
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const { userInfo } = React.useContext(AuthenticationContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { mutate: sendSubmitBuddyRequest, isLoading: isSendingBuddyRequest } =
    useMutation(
      ["send-buddy-request"],
      (userId?: number) => sendBuddyRequest(userInfo?.id, Number(userId)),
      {
        onSuccess: (data, variables) => {
          toast.success("Buddy request successfully sent");

          if (!!onSuccess) {
            onSuccess?.();
          } else {
            navigate(-1);
          }
        },
        onError: () => {
          toast.error("Failed to send buddy request");
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
