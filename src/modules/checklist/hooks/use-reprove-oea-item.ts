import useApiMutation from "hooks/use-api-mutations";

const useReproveOeaItem = (checklistId: string) => {
  return useApiMutation({
    method: "PATCH",
    url: `/oea-checklists/${checklistId}/disapprove-item`,
    errorTitle: "Erro ao reprovar item",
  });
};

export default useReproveOeaItem;
