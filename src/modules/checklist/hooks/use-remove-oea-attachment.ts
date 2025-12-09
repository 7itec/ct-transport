import useApiMutation from "hooks/use-api-mutations";

const useRemoveOeaAttachment = (checklistId: string) => {
  return useApiMutation({
    method: "PATCH",
    url: `/oea-checklists/${checklistId}/remove-attachment`,
    errorTitle: "Erro ao reprovar item",
  });
};

export default useRemoveOeaAttachment;
