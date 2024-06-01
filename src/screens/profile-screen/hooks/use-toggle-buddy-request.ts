import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { toggleBuddyInvitation } from '../../../api/users/requests';
import { AuthenticationContext } from '../../../components/context/providers/authentication-provider';
import { BuddyRequestActionEnum } from '../../../types/users/buddy-request-action-enum.dto';

interface IToggleBuddyRequestValues {
  status?: BuddyRequestActionEnum;
  buddyToBeId?: number;
}

interface IUseToggleBuddyRequestProps {
  onSuccess?: () => void;
}

export const useToggleBuddyRequest = ({ onSuccess }: IUseToggleBuddyRequestProps = {}) => {
  const queryClient = useQueryClient();
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const { userInfo } = React.useContext(AuthenticationContext);

  const { mutate: sendToggleBuddyRequest, isLoading: isTogglingBuddyRequest } = useMutation(
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
        queryClient.invalidateQueries(['buddies']);
        queryClient.invalidateQueries(['buddy-state']);

        if (variables?.status === BuddyRequestActionEnum.CONFIRM) {
          toast.success('You have successfully added user as your buddy');
        }

        if (variables?.status === BuddyRequestActionEnum.REJECT) {
          toast.success('You have successfully declined buddy request');
        }
        onSuccess?.();
      },
      onError: (error, variables) => {
        toast.error(
          variables?.status === BuddyRequestActionEnum.CONFIRM
            ? 'Failed to add user as your buddy'
            : 'Failed to decline buddy request'
        );
      }
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
