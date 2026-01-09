import { router, useLocalSearchParams } from "expo-router";
import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import { AlertProps } from "modules/alerts/types";
import alertsKeys from "modules/alerts/util/alerts-keys";

const useFinishOeaAlert = (checklistId: string) => {
  const { alertId } = useLocalSearchParams<{ alertId: string }>();
  const alertsQuery = useQueryHelpers<AlertProps>(alertsKeys.list());

  const onSuccess = () => {
    alertsQuery.remove({ _id: alertId });

    router.back();
  };

  return useApiMutation({
    method: "PATCH",
    url: `/oea-checklists/${checklistId}/finish`,
    errorTitle: "Erro ao finalizar o checklist",
    onSuccess,
  });
};

export default useFinishOeaAlert;
