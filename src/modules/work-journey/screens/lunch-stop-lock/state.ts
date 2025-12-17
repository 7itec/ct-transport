import { useBackHandler } from "@react-native-community/hooks";
import { router } from "expo-router";
import useLogs from "hooks/use-logs";
import getGpsCoordinates from "modules/geolocation/hooks/get-gps-coordinates";
import useCancelStop from "modules/work-journey/hooks/use-cancel-stop";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import useResumeStop from "modules/work-journey/hooks/use-resume-stop";
import { DriverStatus, WorkStopsEnum } from "modules/work-journey/types";
import { useEffect } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import dateFnsHelpers from "util/date-fns-helpers";
import generateId from "util/generate-id";

const useLunchStopLockState = () => {
  const { data } = useCurrentWorkJourney();

  const trackEvent = useLogs();

  const workStopId =
    data?.currentWorkJourney?.lastWorkRecord?.payload?.workStopId;
  const canCancel = () =>
    data?.currentWorkJourney?.lastWorkRecord?.registrationDate &&
    dateFnsHelpers.differenceInSecondsFromNow(
      data?.currentWorkJourney.lastWorkRecord?.registrationDate
    ) <
      60 * 5;

  const resumeStopMutation = useResumeStop();
  const cancelStopMutation = useCancelStop();

  useBackHandler(() => {
    return true;
  });

  useEffect(() => {
    trackEvent("Lunch Stop Lock");
  }, []);

  useEffect(() => {
    if (data?.currentWorkJourney?.driverStatus !== DriverStatus.STOPPED)
      router.replace("/");
  }, [data?.currentWorkJourney]);

  const handleResumeDriverStop = () => {
    if (!data?.currentWorkJourney) return;

    trackEvent("Finish Stop", {
      workStopName: "Horário de alimentação",
      workStopId: WorkStopsEnum.meal,
    });

    const lunchStops = data?.currentWorkJourney.stopCounts.lunch;

    if (
      workStopId === WorkStopsEnum.meal &&
      lunchStops === 0 &&
      dateFnsHelpers.differenceInMinutesFromNow(
        data?.currentWorkJourney.lastWorkRecord?.registrationDate
      ) < 30
    )
      return Toast.show({
        type: "error",
        text1: "Parada para alimentação",
        text2:
          "Você está parado, cumpra seu tempo de alimentação para continuar!",
      });

    Alert.alert(
      "Retomar jornada de trabalho",
      "Deseja realmente retomar a sua jornada de trabalho ?",
      [
        {
          text: "Cancelar",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            const { latitude, longitude } = await getGpsCoordinates();

            resumeStopMutation.mutate({
              latitude,
              longitude,
              workStopId:
                data?.currentWorkJourney?.lastWorkRecord?.payload?.workStopId,
              registrationDate: new Date(),
              id: generateId(),
            });
          },
        },
      ]
    );
  };

  const handleCancelStop = () => {
    if (!canCancel())
      return Toast.show({
        type: "error",
        text1: "Erro ao cancelar parada",
        text2:
          "Não é possivel cancelar a parada, você está parado a mais de 5 minutos",
      });

    Alert.alert("Cancelar parada", "Deseja realmente cancelar a parada ?", [
      {
        text: "Cancelar",
      },
      {
        text: "Confirmar",
        onPress: async () => {
          const { latitude, longitude } = await getGpsCoordinates();

          cancelStopMutation.mutate({
            latitude,
            longitude,
            registrationDate: new Date(),
          });
        },
      },
    ]);
  };

  return {
    handleResumeDriverStop,
    isLoadingCancelStop: cancelStopMutation.isLoading,
    isLoadingResumeStop: resumeStopMutation.isLoading,
    handleCancelStop,
    canCancel,
    registrationDate:
      data?.currentWorkJourney?.lastWorkRecord.registrationDate!,
  };
};

export default useLunchStopLockState;
