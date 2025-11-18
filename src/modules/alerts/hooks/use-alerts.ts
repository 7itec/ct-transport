import useApiQuery from "hooks/use-api-query";
import { AlertProps } from "../types";
import alertsKeys from "../util/alerts-keys";

const useAlerts = () => {
  return useApiQuery<AlertProps[]>({
    url: "/alerts",
    queryKey: alertsKeys.list(),
    errorTitle: "Erro ao buscar alertas",
    params: {
      projection:
        "_id protocol.title protocol.priority protocol.alertCode protocol.name workRecord workRecordRectificationId createdAt payload validated",
      page: 0,
      limit: 20,
      orderBy: -1,
      orderField: "_id",
    },
  });
};

export default useAlerts;
