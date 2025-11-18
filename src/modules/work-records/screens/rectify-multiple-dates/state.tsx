import { useRef } from "react";
import { ConfirmPasswordRefProps } from "components/confirm-password";
import Toast from "react-native-toast-message";
import useServerConnection from "modules/offline-processor/hooks/use-server-connection";
import useAlert from "modules/alerts/hooks/use-alert";
import useGps from "modules/geolocation/hooks/use-gps";
import useRectifyMultipleDates from "modules/work-records/hooks/use-rectify-multiple-dates";
import { MultiDateWorkRecordProps } from "modules/work-records/types";

const useRectifyMultipleDatesState = (alertId: string) => {
  const { data, isLoading } = useAlert(alertId);
  const confirmPasswordRef = useRef<ConfirmPasswordRefProps>(null);

  const { latitude, longitude } = useGps();

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
