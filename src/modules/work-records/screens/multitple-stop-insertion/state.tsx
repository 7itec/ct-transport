import { useRef } from "react";
import { ConfirmPasswordRefProps } from "components/confirm-password";
import Toast from "react-native-toast-message";
import useServerConnection from "modules/offline-processor/hooks/use-server-connection";
import useMultipleStopInsertion from "modules/work-records/hooks/use-multiple-stop-insertion";
import useAlert from "modules/alerts/hooks/use-alert";
import useLogs from "hooks/use-logs";
import useGps from "modules/geolocation/hooks/use-gps";

const useMultipleStopInsertionState = (alertId: string) => {
  const { data, isLoading } = useAlert(alertId);
  const confirmPasswordRef = useRef<ConfirmPasswordRefProps>(null);
  const { latitude, longitude } = useGps();

  const trackEvent = useLogs();

  const multipleStopInsertionMutation = useMultipleStopInsertion(
    data?.workRecordRectificationId!
  );

  const isServerConnection = useServerConnection();

  const handleFinish = async () => {
    if (!isServerConnection)
      return Toast.show({
        type: "error",
        text1: "Erro ao inserir paradas",
        text2: "Não é possível inserir paradas sem conexão com a internet",
      });

    trackEvent("Multiple Stop Insertion", {
      alertId,
    });

    multipleStopInsertionMutation.mutate({
      latitude,
      longitude,
      registrationDate: new Date(),
    });
  };

  return {
    handleFinish,
    isLoadingAction: multipleStopInsertionMutation.isLoading,
    confirmPasswordRef,
    isLoading,
    data,
  };
};

export default useMultipleStopInsertionState;
