import { useLocalSearchParams } from "expo-router";
import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import { AlertProps } from "modules/alerts/types";
import alertsKeys from "modules/alerts/util/alerts-keys";

const useReproveOeaItem = (checklistId: string) => {
  const { alertId } = useLocalSearchParams<{ alertId: string }>();
  const alertQuery = useQueryHelpers<AlertProps>(alertsKeys.details(alertId));

  const onSuccess = (data: any) => {
    if (!alertQuery.data) return;

    const alert = alertQuery.data;

    alertQuery.setData({
      ...alert,
      payload: {
        ...alert.payload,
        checklistData: {
          ...alert.payload.checklistData,
          ...data.checklist,
        },
      },
    });
  };

  return useApiMutation({
    method: "PATCH",
    url: `/oea-checklists/${checklistId}/disapprove-item`,
    errorTitle: "Erro ao reprovar item",
    onSuccess,
  });
};

export default useReproveOeaItem;
