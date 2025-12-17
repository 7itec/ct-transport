import { useRef } from "react";
import { ConfirmPasswordRefProps } from "components/confirm-password";
import Toast from "react-native-toast-message";
import useServerConnection from "modules/offline-processor/hooks/use-server-connection";
import useAlert from "modules/alerts/hooks/use-alert";
import useRectifyMultipleDates from "modules/work-records/hooks/use-rectify-multiple-dates";
import { MultiDateWorkRecordProps } from "modules/work-records/types";
import useLogs from "hooks/use-logs";
import getGpsCoordinates from "modules/geolocation/hooks/get-gps-coordinates";

const useRectifyMultipleDatesState = (alertId: string) => {
  const { data, isLoading } = useAlert(alertId);
  const confirmPasswordRef = useRef<ConfirmPasswordRefProps>(null);

  const trackEvent = useLogs();

  const rectifyMultipleDatesMutation = useRectifyMultipleDates(
    data?.workRecordRectificationId!
  );

  const isServerConnection = useServerConnection();

  const handleFinish = async () => {
    if (!isServerConnection)
      return Toast.show({
        type: "error",
        text1: "Erro ao inserir paradas",
        text2:
          "Não é possível alterar as datas dos registros de trabalho sem conexão com a internet",
      });

    trackEvent("Multiple Date Rectification Opened", {
      alertId,
    });

    const { latitude, longitude } = await getGpsCoordinates();

    rectifyMultipleDatesMutation.mutate({
      latitude,
      longitude,
      registrationDate: new Date(),
    });
  };

  return {
    handleFinish,
    isLoadingAction: rectifyMultipleDatesMutation.isLoading,
    confirmPasswordRef,
    isLoading,
    workRecords: data?.payload.workRecords as MultiDateWorkRecordProps[],
    createdAt: data?.createdAt,
  };
};

export default useRectifyMultipleDatesState;
