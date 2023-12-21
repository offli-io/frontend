import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { sendBuddyRequest } from '../../../api/activities/requests';
import { AuthenticationContext } from '../../../assets/theme/authentication-provider';

interface IUseSendBuddyRequestProps {
  onSuccess?: () => void;
}

export const useSendBuddyRequest = ({ onSuccess }: IUseSendBuddyRequestProps = {}) => {
  const { userInfo } = React.useContext(AuthenticationContext);
  const navigate = useNavigate();

  const { mutate: sendSubmitBuddyRequest, isLoading: isSendingBuddyRequest } = useMutation(
    ['send-buddy-request'],
    (userId?: number) => sendBuddyRequest(userInfo?.id, Number(userId)),
    {
      onSuccess: () => {
        toast.success('Buddy request successfully sent');

        if (onSuccess) {
          onSuccess?.();
        } else {
          navigate(-1);
        }
      },
      onError: () => {
        toast.error('Failed to send buddy request');
      }
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
