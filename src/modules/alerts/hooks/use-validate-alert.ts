import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import alertsKeys from "../util/alerts-keys";
import { AlertProps } from "../types";

const useValidateAlert = (alertId: string) => {
  const { data: alerts, setData } = useQueryHelpers<AlertProps[]>(
    alertsKeys.list()
  );

  const onSuccess = () => {
    if (!alerts) return;

    setData(alerts.filter((alert) => alert._id !== alertId));
  };

  return useApiMutation({
    method: "PATCH",
    url: `/alerts/${alertId}/validated`,
    errorTitle: "Erro ao validar alerta",
    onSuccess,
  });
};
export default useValidateAlert;
