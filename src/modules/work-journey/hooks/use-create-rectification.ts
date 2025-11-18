import useApiMutation from "hooks/use-api-mutations";

const useCreateRectification = () => {
  return useApiMutation({
    method: "PATCH",
    url: (data) =>
      `/work-records/${data.workRecordId}/rectification/exceeded-work-journey/rectify`,
    errorTitle: "Erro ao criar justificativa",
  });
};

export default useCreateRectification;
