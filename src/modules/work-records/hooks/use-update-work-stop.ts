import { router } from "expo-router";
import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import { AlertProps } from "modules/alerts/types";
import alertsKeys from "modules/alerts/util/alerts-keys";

interface Props {
  alertId: string;
  workStopId: string;
}

const useUpdateWorkStop = (workRecordId: string) => {
  const { data: alerts, setData } = useQueryHelpers<AlertProps[]>(
    alertsKeys.list()
  );

  const onSuccess = () => {
    router.back();

    if (!alerts) return;

    setData(
      alerts.filter((alert) => alert.payload.workRecordId !== workRecordId)
    );
  };

  return useApiMutation({
    method: "PATCH",
    url: `/work-records/${workRecordId}/rectification/work-stop/rectify`,
    onSuccess,
    errorTitle: "Erro ao confirmar alteração de parada.",
  });
};

export default useUpdateWorkStop;
