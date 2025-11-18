import { Alert } from "react-native";
import useCurrentWorkJourney from "./use-current-work-journey";
import useGps from "modules/geolocation/hooks/use-gps";
import useResumeStop from "./use-resume-stop";
import dateFnsHelpers from "util/date-fns-helpers";
import Toast from "react-native-toast-message";
import { WorkStopsEnum } from "../types";

const useHandleResumeStop = () => {
  const resumeStopMutation = useResumeStop();
  const { data } = useCurrentWorkJourney();
  const location = useGps();

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
          onPress: () =>
            resumeStopMutation.mutate({
              workStopId: lastWorkRecord.payload.workStopId,
              registrationDate: new Date(),
              latitude: location?.latitude,
              longitude: location?.longitude,
            }),
        },
      ]
    );
  };

  return { handleResumeStop, isLoading: resumeStopMutation.isLoading };
};

export default useHandleResumeStop;
