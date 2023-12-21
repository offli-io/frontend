import ActivityCreatedScreen from 'screens/static-screens/activity-created-screen';
import { ActivityDetailsForm } from '../components/activity-details-form';
import { ActivityPhotoForm } from '../components/activity-photo-form';
import { ActivityTypeForm } from '../components/activity-type-form';
import { DateTimeForm } from '../components/date-time-form';
import { NameForm } from '../components/name-form';
import { PlaceForm } from '../components/place-form';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './validation-schema';
import { NavigateFunction } from 'react-router-dom';
import { ApplicationLocations } from 'types/common/applications-locations.dto';

interface IRenderProperFormProps {
  activeStep?: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  methods: UseFormReturn<FormValues, object>;
  isMap?: boolean;
  toggleMap: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  pendingRedirectActivityId?: number;
}

export const renderProperForm = ({
  activeStep,
  setActiveStep,
  methods,
  isMap,
  toggleMap,
  navigate,
  pendingRedirectActivityId
}: IRenderProperFormProps) => {
  switch (activeStep) {
    case 0:
      return (
        <NameForm
          onNextClicked={() => setActiveStep((activeStep) => activeStep + 1)}
          methods={methods}
        />
      );
    case 1:
      return (
        <PlaceForm
          onNextClicked={() => setActiveStep((activeStep) => activeStep + 1)}
          onBackClicked={() => setActiveStep((activeStep) => activeStep - 1)}
          methods={methods}
          isMap={isMap}
          toggleMap={toggleMap}
        />
      );
    case 2:
      return (
        <ActivityTypeForm
          onNextClicked={() => setActiveStep((activeStep) => activeStep + 1)}
          onBackClicked={() => setActiveStep((activeStep) => activeStep - 1)}
          methods={methods}
        />
      );
    case 3:
      return (
        <DateTimeForm
          onNextClicked={() => setActiveStep((activeStep) => activeStep + 1)}
          onBackClicked={() => setActiveStep((activeStep) => activeStep - 1)}
          methods={methods}
        />
      );
    case 4:
      return (
        <ActivityDetailsForm
          onNextClicked={() => setActiveStep((activeStep) => activeStep + 1)}
          onBackClicked={() => setActiveStep((activeStep) => activeStep - 1)}
          methods={methods}
        />
      );
    case 5:
      return (
        <ActivityPhotoForm
          methods={methods}
          onBackClicked={() => setActiveStep((activeStep) => activeStep - 1)}
        />
      );
    case 6:
      return (
        <ActivityCreatedScreen
          onDismiss={() =>
            navigate(`${ApplicationLocations.ACTIVITY_DETAIL}/${pendingRedirectActivityId}`, {
              state: {
                openInviteDrawer: true
              }
            })
          }
        />
      );
    default:
      return null;
  }
};
