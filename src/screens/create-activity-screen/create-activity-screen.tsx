import { yupResolver } from "@hookform/resolvers/yup";
import { Box, useTheme } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ActivityDurationTypeEnumDto } from "types/activities/activity-duration-type-enum.dto";
import { createActivity } from "../../api/activities/requests";
import { AuthenticationContext } from "../../assets/theme/authentication-provider";
import { PageWrapper } from "../../components/page-wrapper";
import DotsMobileStepper from "../../components/stepper";
import { useUser } from "../../hooks/use-user";
import { ActivityVisibilityEnum } from "../../types/activities/activity-visibility-enum.dto";
import { calculateDateUsingDuration } from "./utils/calculate-date-using-duration.util";
import { renderProperForm } from "./utils/render-proper-form.util";
import { FormValues, validationSchema } from "./utils/validation-schema";

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
    resolver: yupResolver(validationSchema(activeStep)),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = methods;

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
      const { dateTimeFrom, datetimeUntil } = calculateDateUsingDuration({
        duration: data?.duration,
        durationType: data?.durationType,
        datetimeFrom: data?.datetime_from,
        timeFrom: data?.timeFrom,
      });

      sendCreateActivity({
        ...restValues,
        datetime_from: dateTimeFrom,
        datetime_until: datetimeUntil,
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

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      //behavior: '',
    });
  }, [activeStep]);

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
            height: isMap ? "100%" : "78vh",
            width: "100%",
            //TODO in the future maybe include navigation height in the PageWrapper component for now pb: 12 is enough
            // paddingBottom: theme.spacing(20),
          }}
          onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
        >
          {renderProperForm({
            activeStep,
            setActiveStep,
            methods,
            isMap,
            toggleMap,
            navigate,
            pendingRedirectActivityId,
          })}
        </form>
      </PageWrapper>
    </Box>
  );
};

export default CreateActivityScreen;
