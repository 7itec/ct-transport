import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ConfirmPasswordRefProps } from "components/confirm-password";
import useServerConnection from "modules/offline-processor/hooks/use-server-connection";
import Toast from "react-native-toast-message";
import useGps from "modules/geolocation/hooks/use-gps";
import useWorkRecord from "modules/work-records/hooks/use-work-record";
import useAlert from "modules/alerts/hooks/use-alert";
import { UpdateWorkStopTypeProps } from "modules/work-records/types";
import useUpdateWorkStop from "modules/work-records/hooks/use-update-work-stop";

const useWorkStopState = (workRecordId: string, alertId: string) => {
  const { data, isLoading } = useWorkRecord(workRecordId);
  const alertQuery = useAlert(alertId);

  const { previousWorkStop, requestedWorkStopChange, workStopId } =
    (alertQuery.data?.payload as UpdateWorkStopTypeProps) ?? {};

  const previousDate = data?.previousWorkRecord?.registrationDate;
  const nextDate = data?.nextWorkRecord?.registrationDate;

  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (previousDate && !date) setDate(new Date(previousDate));
  }, [previousDate]);

  const [datePicker, showDatePicker] = useState(false);
  const [timePicker, showTimePicker] = useState(false);
  const confirmPasswordRef = useRef<ConfirmPasswordRefProps>(null);

  const isServerConnection = useServerConnection();
  const { latitude, longitude } = useGps();

  const updateWorkStopMutation = useUpdateWorkStop(workRecordId);

  const onChange = (date: Date) => {
    showDatePicker(false);
    showTimePicker(false);
    if (!date) return;
    setDate(date);
  };

  const handleFinish = () => {
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

    updateWorkStopMutation.mutate({
      workStopId,
      latitude,
      longitude,
      registrationDate: new Date(),
    });
  };

  const intervalMessage =
    previousDate &&
    nextDate &&
    `Informe uma data entre ${format(
      new Date(previousDate),
      "dd/MM/yyyy HH:mm"
    )} e  ${format(new Date(nextDate), "dd/MM/yyyy HH:mm")}.`;

  const previousDateOnlyMessage = `Informe uma data após ${
    previousDate && format(new Date(previousDate), "dd/MM/yyyy HH:mm")
  }.`;

  const nextDateOnlyMessage = `Informe uma data antes de ${
    nextDate && format(new Date(nextDate), "dd/MM/yyyy HH:mm")
  }.`;

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
