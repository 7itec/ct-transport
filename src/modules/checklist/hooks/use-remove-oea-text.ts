import useApiMutation from "hooks/use-api-mutations";

const useRemoveOeaText = (checklistId: string) => {
  return useApiMutation({
    method: "PATCH",
    url: `/oea-checklists/${checklistId}/add-attachment`,
    errorTitle: "Erro ao remover texto",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default useRemoveOeaText;
