import useApiQuery from "hooks/use-api-query";
import { AlertProps } from "../types";
import alertsKeys from "../util/alerts-keys";

const useAlert = (alertId: string) => {
  return useApiQuery<AlertProps>({
    url: `/alerts/${alertId}`,
    queryKey: alertsKeys.details(alertId),
    errorTitle: "Erro ao buscar alerta",
  });
};

export default useAlert;
