import { router } from "expo-router";
import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import { AlertProps } from "modules/alerts/types";
import alertsKeys from "modules/alerts/util/alerts-keys";

const useUpdateWorkRecordDate = (workRecordId: string) => {
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
    url: `/work-records/${workRecordId}/rectification/date/rectify`,
    errorTitle: "Erro ao alterar data do registro de trabalho",
    onSuccess,
  });
};

export default useUpdateWorkRecordDate;
