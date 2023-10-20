import { yupResolver } from "@hookform/resolvers/yup";
import { Box, useTheme } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { add, setHours, setMinutes } from "date-fns";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ActivityDurationTypeEnumDto } from "types/activities/activity-duration-type-enum.dto";
import * as yup from "yup";
import { createActivity } from "../../api/activities/requests";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import OffliButton from "../../components/offli-button";
import { PageWrapper } from "../../components/page-wrapper";
import DotsMobileStepper from "../../components/stepper";
import { useUser } from "../../hooks/use-user";
import { ActivityVisibilityEnum } from "../../types/activities/activity-visibility-enum.dto";
import { ILocation } from "../../types/activities/location.dto";
import { ApplicationLocations } from "../../types/common/applications-locations.dto";
import ActivityCreatedScreen from "../static-screens/activity-created-screen";
import { ActivityDetailsForm } from "./components/activity-details-form";
import { ActivityPhotoForm } from "./components/activity-photo-form";
import { ActivityTypeForm } from "./components/activity-type-form";
import { DateTimeForm } from "./components/date-time-form";
import { NameForm } from "./components/name-form";
import { PlaceForm } from "./components/place-form";
import { calculateDateUsingDuration } from "./utils/calculate-date-using-duration.util";

export interface FormValues {
  title?: string;
  description?: string;
  location?: ILocation | null;
  tags?: string[];
  //todo alter keys
  datetime_from?: Date;
  datetime_until?: Date;
  // public?: boolean
  //repeated?: ActivityRepetitionOptionsEnum | string
  price?: number | null;
  title_picture?: string;
  placeQuery?: string;
  visibility?: ActivityVisibilityEnum;
  limit?: number;
  isActivityFree?: boolean;
  timeFrom?: string | null;
  duration?: number;
  durationType?: ActivityDurationTypeEnumDto;
}

const schema: (activeStep: number) => yup.SchemaOf<FormValues> = (
  activeStep: number
) =>
  yup.object({
    title:
      activeStep === 0
        ? yup.string().defined().required()
        : yup.string().notRequired(),
    location:
      activeStep === 1
        ? yup
            .object({
              name: yup.string().defined().required(),
              coordinates: yup.object({
                lat: yup.number().defined().required(),
                lon: yup.number().defined().required(),
              }),
            })
            .notRequired()
        : yup
            .object({
              name: yup.string().defined().required(),
              coordinates: yup.object({
                lat: yup.number().defined().required(),
                lon: yup.number().defined().required(),
              }),
            })
            .nullable(true)
            .notRequired(),

    tags:
      activeStep === 2
        ? yup.array().of(yup.string()).defined().required()
        : yup.array().of(yup.string()).notRequired(),
    datetime_from:
      activeStep === 3
        ? yup.date().defined().required()
        : yup.date().notRequired(),
    datetime_until:
      activeStep === 3
        ? yup.date().defined().required()
        : yup.date().notRequired(),
    price:
      activeStep === 4
        ? yup
            .number()
            .when("isActivityFree", {
              is: (isActivityFree?: boolean) => !!isActivityFree,
              then: (schema) => schema.notRequired(),
              otherwise: (schema) => schema.defined().required(),
            })
            .typeError(
              "Price must be a number. Check 'free' or leave empty for free price"
            )
        : yup.number().notRequired().nullable(true),
    limit:
      activeStep === 4
        ? yup.number().required().defined()
        : yup.number().notRequired(),
    title_picture: yup.string().notRequired(),
    placeQuery: yup.string().notRequired(),
    description: yup.string().notRequired(),
    visibility: yup
      .mixed<ActivityVisibilityEnum>()
      .oneOf(Object.values(ActivityVisibilityEnum))
      .notRequired(),
    isActivityFree: yup.bool().notRequired(),
    timeFrom:
      activeStep === 3
        ? yup.string().defined().required().nullable(true)
        : yup.string().notRequired().nullable(true),
    duration:
      activeStep === 3
        ? yup.number().defined().required()
        : yup.number().notRequired(),
    durationType:
      activeStep === 3
        ? yup
            .mixed<ActivityDurationTypeEnumDto>()
            .oneOf(Object.values(ActivityDurationTypeEnumDto))
            .defined()
            .required()
        : yup
            .mixed<ActivityDurationTypeEnumDto>()
            .oneOf(Object.values(ActivityDurationTypeEnumDto))
            .notRequired(),
  });

const CreateActivityScreen = () => {
  const { palette } = useTheme();
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [pendingRedirectActivityId, setPendingRedirectActivityId] =
    React.useState<number | undefined>();
  const [isMap, toggleMap] = React.useState(false);

  const navigate = useNavigate();
  const { userInfo } = React.useContext(AuthenticationContext);
  const { data: { data: userData = {} } = {}, isLoading: isUserDataLoading } =
    useUser({
      id: userInfo?.id,
    });
  const wrapper = React.useRef<HTMLDivElement | null>(null);

  const methods = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      visibility: ActivityVisibilityEnum.public,
      // price: ActivityPriceOptionsEnum.free,
      limit: 10,
      location: null,
      isActivityFree: true,
      timeFrom: "",
      durationType: ActivityDurationTypeEnumDto.HOURS,
      // duration: null,
    },
    resolver: yupResolver(schema(activeStep)),
    mode: "onChange",
  });

  const { control, handleSubmit, formState, watch } = methods;

  const {
    data,
    mutate: sendCreateActivity,
    isLoading,
  } = useMutation(
    ["create-activity"],
    (formValues: FormValues & { creator_id?: number }) =>
      createActivity(formValues),
    {
      onSuccess: (data) => {
        //invalidate user activites
        queryClient.setQueryData(["created-activity-data"], data?.data);
        queryClient.invalidateQueries(["user-info"]);
        //TODO query invalidation doesnt work - activities are not refetched!
        queryClient.invalidateQueries({ queryKey: ["activities"] });
        queryClient.invalidateQueries({ queryKey: ["participant-activities"] });
        setPendingRedirectActivityId(data?.data?.id);
        setActiveStep((activeStep) => activeStep + 1);
      },
      onError: (error) => {
        toast.error("Failed to create new activity");
      },
    }
  );

  const handleFormSubmit = React.useCallback(
    (data: FormValues) => {
      const { placeQuery, price, isActivityFree, ...restValues } = data;
      //TODO fill with real user data
      const finalPrice = isActivityFree ? 0 : price;
      const { id = undefined } = { ...userData };

      // handle time values in from and until datetime
      const dateTimeUntil = calculateDateUsingDuration({
        duration: data?.duration,
        durationType: data?.durationType,
        datetimeFrom: data?.datetime_from,
        timeFrom: data?.timeFrom,
      });

      sendCreateActivity({
        ...restValues,
        datetime_from: data?.datetime_from,
        datetime_until: dateTimeUntil,
        price: finalPrice,
        creator_id: id,
      });
    },
    [userData, sendCreateActivity]
  );

  const handleFormError = React.useCallback(
    (error: any) => console.log(error),
    []
  );

  const handleBackClicked = React.useCallback(
    () => setActiveStep((activeStep) => activeStep - 1),
    [setActiveStep]
  );

  const renderProperContent = React.useCallback(() => {
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
            onBackClicked={handleBackClicked}
            methods={methods}
            isMap={isMap}
            toggleMap={toggleMap}
          />
        );
      case 2:
        return (
          <ActivityTypeForm
            onNextClicked={() => setActiveStep((activeStep) => activeStep + 1)}
            onBackClicked={handleBackClicked}
            methods={methods}
          />
        );
      case 3:
        return (
          <DateTimeForm
            onNextClicked={() => setActiveStep((activeStep) => activeStep + 1)}
            onBackClicked={handleBackClicked}
            methods={methods}
          />
        );
      case 4:
        return (
          <ActivityDetailsForm
            onNextClicked={() => setActiveStep((activeStep) => activeStep + 1)}
            onBackClicked={handleBackClicked}
            methods={methods}
          />
        );
      case 5:
        return (
          <ActivityPhotoForm
            methods={methods}
            onBackClicked={handleBackClicked}
          />
        );
      case 6:
        return (
          <ActivityCreatedScreen
            onDismiss={() =>
              navigate(
                `${ApplicationLocations.ACTIVITY_DETAIL}/${pendingRedirectActivityId}`,
                {
                  state: {
                    openInviteDrawer: true,
                  },
                }
              )
            }
          />
        );
      default:
        return (
          <Box>
            <OffliButton type="submit">Logni data</OffliButton>
          </Box>
        );
    }
  }, [activeStep, methods, isMap]);

  const getFormLayout = React.useCallback(() => {
    switch (activeStep) {
      case 0:
        return "center";
      case 1:
        return "center";
      case 5:
        return "space-evenly";
      default:
        return "flex-start";
    }
  }, [activeStep]);
  const centerContent = [0, 1].includes(activeStep);

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      //behavior: '',
    });
  }, [activeStep]);

  const onBeforeUnload = () => console.log("odchadzas?");

  React.useEffect(() => {
    if (wrapper?.current) {
      wrapper?.current?.addEventListener("beforeunload", onBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  });

  React.useEffect(() => {
    return () => setActiveStep(0);
  }, []);

  return (
    <Box ref={wrapper} sx={isMap ? { height: "100%" } : undefined}>
      {activeStep <= 5 && (
        <DotsMobileStepper activeStep={activeStep} containerSx={{ p: 0 }} />
      )}
      <PageWrapper
        sxOverrides={{
          alignItems: "center",
          px: isMap ? 0 : 3,
          bgcolor: palette.background.default,
          ...(isMap ? { mt: 0, height: "100%" } : {}),
        }}
      >
        <form
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: getFormLayout(),
            flexDirection: "column",
            height: isMap ? "100vh" : "78vh",
            width: "100%",
            //TODO in the future maybe include navigation height in the PageWrapper component for now pb: 12 is enough
            // paddingBottom: theme.spacing(20),
          }}
          onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
        >
          {renderProperContent()}
        </form>
      </PageWrapper>
    </Box>
  );
};

export default CreateActivityScreen;
