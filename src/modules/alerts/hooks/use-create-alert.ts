import useApiMutation from "hooks/use-api-mutations";

const useCreateAlert = () => {
  return useApiMutation({
    method: "POST",
    url: "/alerts",
    errorTitle: "Erro ao criar alerta",
  });
};

export default useCreateAlert;
