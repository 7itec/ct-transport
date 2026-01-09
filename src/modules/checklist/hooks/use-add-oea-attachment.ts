import { useLocalSearchParams } from "expo-router";
import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import { AlertProps } from "modules/alerts/types";
import alertsKeys from "modules/alerts/util/alerts-keys";
import formatEoaChecklistData from "../util/format-eoa-checklist-data";

const useAddOeaAttachment = (checklistId: string) => {
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
    url: `/oea-checklists/${checklistId}/add-attachment`,
    errorTitle: "Erro ao adicionar anexo",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    formatData: formatEoaChecklistData,
    onSuccess,
  });
};

export default useAddOeaAttachment;
