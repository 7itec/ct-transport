import { Alert } from "react-native";
import useResumeStop from "./use-resume-stop";
import dateFnsHelpers from "util/date-fns-helpers";
import Toast from "react-native-toast-message";
import { WorkStopsEnum } from "../types";
import useLogs from "hooks/use-logs";
import useGps from "modules/geolocation/hooks/use-gps";
import useProfileStorage from "modules/users/storage/use-profile-storage";

const useHandleResumeStop = () => {
  const resumeStopMutation = useResumeStop();
  const { profile } = useProfileStorage();
  const trackEvent = useLogs();

  const handleResumeStop = () => {
    if (!profile?.currentWorkJourney?.lastWorkRecord) return;
    const { latitude, longitude } = useGps();

    const { lastWorkRecord, stopCounts } = profile.currentWorkJourney;

    const workStopId = lastWorkRecord?.payload?.workStopId;
    const lunchStops = stopCounts.lunch;

    if (
      workStopId === WorkStopsEnum.meal &&
      lunchStops === 0 &&
      dateFnsHelpers.differenceInMinutesFromNow(
        lastWorkRecord?.registrationDate
      ) < 30
    )
      return Toast.show({
        type: "error",
        text1: "Horário de alimentação",
        text2: `Você deve aguardar até ás ${dateFnsHelpers.format(
          dateFnsHelpers.addMinutes(lastWorkRecord?.registrationDate, 30),
          "HH:mm"
        )} para continuar`,
      });

    Alert.alert(
      "Finalizar parada",
      "Deseja realmente finalizar a parada informada ?",
      [
        {
          text: "Cancelar",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            trackEvent("Finish Stop", {
              workStopName:
                profile?.currentWorkJourney?.lastWorkRecord?.payload
                  ?.workStopName,
            });

            resumeStopMutation.mutate({
              latitude,
              longitude,
              workStopId: lastWorkRecord.payload.workStopId,
              registrationDate: new Date(),
            });
          },
        },
      ]
    );
  };

  return { handleResumeStop, isLoading: resumeStopMutation.isLoading };
};

export default useHandleResumeStop;
