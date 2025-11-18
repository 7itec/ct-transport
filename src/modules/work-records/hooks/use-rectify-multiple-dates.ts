import { router } from "expo-router";
import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import { AlertProps } from "modules/alerts/types";
import alertsKeys from "modules/alerts/util/alerts-keys";

const useRectifyMultipleDates = (workRecordRectificationId: string) => {
  const { data: alerts, setData } = useQueryHelpers<AlertProps[]>(
    alertsKeys.list()
  );

  const onSuccess = () => {
    router.back();

    if (!alerts) return;

    setData(
      alerts.filter(
        (alert) => alert.payload.rectificationId !== workRecordRectificationId
      )
    );
  };

  return useApiMutation({
    method: "PATCH",
    url: `/work-records/rectification/${workRecordRectificationId}/multiple-date/rectify`,
    errorTitle: "Erro ao alterar datas dos registros de trabalho",
    onSuccess,
  });
};

export default useRectifyMultipleDates;
