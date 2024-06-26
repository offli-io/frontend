import React from 'react';
import { useActivities } from '../../../hooks/activities/use-activities';
import { IActivityRestDto } from '../../../types/activities/activity-rest.dto';
import { ActivityActionsTypeEnumDto } from '../../../types/common/activity-actions-type-enum.dto';
import ActivityActions from '../../explore-screen/components/activity-actions';

interface IProps {
  onMenuItemClick?: (action?: ActivityActionsTypeEnumDto) => void;
}

const ActivityDetailActionMenu: React.FC<IProps> = ({ onMenuItemClick }) => {
  // cant use useParams() hook because this Provider is outside <Router> context
  const pathnameArray = window.location.href.split('/');
  const activityId = pathnameArray[pathnameArray.length - 1];
  const { data } = useActivities<IActivityRestDto>({
    params: {
      id: Number(activityId)
    }
  });

  return (
    <ActivityActions
      activity={data?.data?.activity}
      onActionClick={onMenuItemClick}
      // contrastText
    />
  );
};

export default ActivityDetailActionMenu;
