import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { IconButton } from '@mui/material';
import OffliButton from 'components/offli-button';
import React from 'react';
import { IBuddyStateDto } from 'types/users/buddy-state.dto';
import { isExistingPendingBuddyState } from 'utils/person.util';
import { AuthenticationContext } from '../../../components/context/providers/authentication-provider';
import { useBuddies } from '../../../hooks/users/use-buddies';
import { isBuddy } from '../utils/is-buddy.util';

interface IAddBuddiesActionContentProps {
  buddieStates?: IBuddyStateDto[];
  userId?: number;
  onAddBuddyClick?: (e: any, userId?: number) => void;
  onAcceptBuddyRequestClick?: (e: any, userId?: number) => void;
  isLoading?: boolean;
}

const AddBuddiesActionContent: React.FC<IAddBuddiesActionContentProps> = ({
  buddieStates = [],
  userId,
  onAddBuddyClick,
  onAcceptBuddyRequestClick,
  isLoading
}) => {
  const { userInfo } = React.useContext(AuthenticationContext);

  const { buddies } = useBuddies();

  const userSentYouBuddyRequest = React.useCallback(
    (userId?: number) =>
      isExistingPendingBuddyState(buddieStates, Number(userInfo?.id), Number(userId)),
    [buddieStates, userInfo?.id]
  );

  const youSentUserBuddyRequest = React.useCallback(
    (userId?: number) =>
      isExistingPendingBuddyState(buddieStates, Number(userId), Number(userInfo?.id)),
    [buddieStates, userInfo?.id]
  );

  if (isBuddy(buddies, userId)) {
    return null;
  }

  if (userSentYouBuddyRequest(userId)) {
    return (
      <OffliButton
        size="small"
        variant="contained"
        sx={{ fontSize: 12 }}
        onClick={(e) => onAcceptBuddyRequestClick?.(e, userId)}
        disabled={isLoading}>
        Accept
      </OffliButton>
    );
  }

  if (youSentUserBuddyRequest(userId)) {
    // return <Chip label="Request sent" />;
    return (
      <OffliButton disabled size="small" variant="contained" sx={{ fontSize: 12, minWidth: 100 }}>
        Request sent
      </OffliButton>
    );
  }

  return (
    <IconButton onClick={(e) => onAddBuddyClick?.(e, userId)} disabled={isLoading} color="primary">
      <PersonAddIcon sx={{ color: 'inherit' }} />
    </IconButton>
  );
};

export default AddBuddiesActionContent;
