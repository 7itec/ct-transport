import { router } from "expo-router";
import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import { AlertProps } from "modules/alerts/types";
import alertsKeys from "modules/alerts/util/alerts-keys";

const useRefuseRectification = (workRecordRectificationId: string) => {
  const { data: alerts, setData } = useQueryHelpers<AlertProps[]>(
    alertsKeys.list()
  );

  const onSuccess = () => {
    router.dismiss(2);

    if (!alerts) return;

    setData(
      alerts.filter(
        (alert) => alert.workRecordRectificationId !== workRecordRectificationId
      )
    );
  };

  return useApiMutation({
    method: "PATCH",
    url: `/work-records/${workRecordRectificationId}/rectification/refuse`,
    errorTitle: "Erro ao alterar paradas",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onSuccess,
  });
};

export default useRefuseRectification;
