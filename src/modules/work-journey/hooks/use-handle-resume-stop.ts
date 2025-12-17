import { Alert } from "react-native";
import useCurrentWorkJourney from "./use-current-work-journey";
import useResumeStop from "./use-resume-stop";
import dateFnsHelpers from "util/date-fns-helpers";
import Toast from "react-native-toast-message";
import { WorkStopsEnum } from "../types";
import useLogs from "hooks/use-logs";
import getGpsCoordinates from "modules/geolocation/hooks/get-gps-coordinates";

const useHandleResumeStop = () => {
  const resumeStopMutation = useResumeStop();
  const { data } = useCurrentWorkJourney();
  const trackEvent = useLogs();

  const handleResumeStop = () => {
    if (!data?.currentWorkJourney?.lastWorkRecord) return;

    const { lastWorkRecord, stopCounts } = data.currentWorkJourney;

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
                data?.currentWorkJourney?.lastWorkRecord?.payload?.workStopName,
            });

            const { latitude, longitude } = await getGpsCoordinates();

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
