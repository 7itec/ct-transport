import useApiMutation from "hooks/use-api-mutations";

const useApproveOeaItem = (checklistId: string) => {
  return useApiMutation({
    method: "PATCH",
    url: `/oea-checklists/${checklistId}/approve-item`,
    errorTitle: "Erro ao aprovar item",
  });
};

export default useApproveOeaItem;
