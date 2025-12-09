import useApiMutation from "hooks/use-api-mutations";

const useAddOeaAttachment = (checklistId: string) => {
  return useApiMutation({
    method: "PATCH",
    url: `/oea-checklists/${checklistId}/add-attachment`,
    errorTitle: "Erro ao adicionar anexo",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default useAddOeaAttachment;
