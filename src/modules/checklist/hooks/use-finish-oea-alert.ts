import useApiMutation from "hooks/use-api-mutations";

const useFinishOeaAlert = (checklistId: string) => {
  const onSuccess = () => {
    // state.alerts = state.alerts.filter(
    //   (alert: OeaChecklistAlertProps) => alert.payload.checklist !== checklistId
    // );
  };

  return useApiMutation({
    method: "PATCH",
    url: `/oea-checklists/${checklistId}/finish`,
    errorTitle: "Erro ao finalizar o checklist",
    onSuccess,
  });
};

export default useFinishOeaAlert;
