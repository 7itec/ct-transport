import { useEffect, useRef, useState } from "react";
import { ConfirmPasswordRefProps } from "components/confirm-password";
import useServerConnection from "modules/offline-processor/hooks/use-server-connection";
import Toast from "react-native-toast-message";
import useWorkRecord from "modules/work-records/hooks/use-work-record";
import useAlert from "modules/alerts/hooks/use-alert";
import { UpdateWorkStopTypeProps } from "modules/work-records/types";
import useUpdateWorkStop from "modules/work-records/hooks/use-update-work-stop";
import useLogs from "hooks/use-logs";
import getGpsCoordinates from "modules/geolocation/hooks/get-gps-coordinates";

const useWorkStopState = (workRecordId: string, alertId: string) => {
  const { data, isLoading } = useWorkRecord(workRecordId);
  const alertQuery = useAlert(alertId);

  const { previousWorkStop, requestedWorkStopChange, workStopId } =
    (alertQuery.data?.payload as UpdateWorkStopTypeProps) ?? {};

  const previousDate = data?.previousWorkRecord?.registrationDate;

  const trackEvent = useLogs();

  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (previousDate && !date) setDate(new Date(previousDate));
  }, [previousDate]);

  const confirmPasswordRef = useRef<ConfirmPasswordRefProps>(null);

  const isServerConnection = useServerConnection();

  const updateWorkStopMutation = useUpdateWorkStop(workRecordId);

  const handleFinish = async () => {
    if (!isServerConnection)
      return Toast.show({
        type: "error",
        text1: "Erro ao alterar registro de trabalho",
        text2:
          "Não é possível alterar registro de trabalho sem conexão com a internet",
      });

    if (!date)
      return Toast.show({
        type: "error",
        text1: "Erro ao alterar registro de trabalho",
        text2: "Data inválida",
      });

    trackEvent("Stop Insertion", {
      workStopId,
      alertId,
    });

    const { latitude, longitude } = await getGpsCoordinates();

    updateWorkStopMutation.mutate({
      workStopId,
      latitude,
      longitude,
      registrationDate: new Date(),
    });
  };

  return {
    isLoadingAction: updateWorkStopMutation.isLoading,
    isLoading: isLoading || alertQuery?.isLoading,
    handleFinish,
    confirmPasswordRef,
    data,
    requestedWorkStopChange,
    previousWorkStop,
  };
};

export default useWorkStopState;
