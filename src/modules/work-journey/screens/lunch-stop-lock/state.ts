import { useBackHandler } from "@react-native-community/hooks";
import { router } from "expo-router";
import useLogs from "hooks/use-logs";
import useGps from "modules/geolocation/hooks/use-gps";
import useProfileStorage from "modules/users/storage/use-profile-storage";
import useCancelStop from "modules/work-journey/hooks/use-cancel-stop";
import useResumeStop from "modules/work-journey/hooks/use-resume-stop";
import { DriverStatus, WorkStopsEnum } from "modules/work-journey/types";
import { useEffect } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import dateFnsHelpers from "util/date-fns-helpers";
import generateId from "util/generate-id";

const useLunchStopLockState = () => {
  const { profile } = useProfileStorage();

  const trackEvent = useLogs();
  const { latitude, longitude } = useGps();

  const workStopId =
    profile?.currentWorkJourney?.lastWorkRecord?.payload?.workStopId;
  const canCancel = () =>
    profile?.currentWorkJourney?.lastWorkRecord?.registrationDate &&
    dateFnsHelpers.differenceInSecondsFromNow(
      profile?.currentWorkJourney.lastWorkRecord?.registrationDate
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
    if (profile?.currentWorkJourney?.driverStatus !== DriverStatus.STOPPED)
      router.replace("/");
  }, [profile?.currentWorkJourney]);

  const handleResumeDriverStop = () => {
    if (!profile?.currentWorkJourney) return;

    trackEvent("Finish Stop", {
      workStopName: "Horário de alimentação",
      workStopId: WorkStopsEnum.meal,
    });

    const lunchStops = profile?.currentWorkJourney.stopCounts.lunch;

    if (
      workStopId === WorkStopsEnum.meal &&
      lunchStops === 0 &&
      dateFnsHelpers.differenceInMinutesFromNow(
        profile?.currentWorkJourney.lastWorkRecord?.registrationDate
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
            resumeStopMutation.mutate({
              latitude,
              longitude,
              workStopId:
                profile?.currentWorkJourney?.lastWorkRecord?.payload
                  ?.workStopId,
              registrationDate: new Date(),
              id: generateId(),
            });

            router.dismissAll();
            router.replace("/");
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
      profile?.currentWorkJourney?.lastWorkRecord.registrationDate!,
  };
};

export default useLunchStopLockState;
