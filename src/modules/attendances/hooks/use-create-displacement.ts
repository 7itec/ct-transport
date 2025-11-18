import { router } from "expo-router";
import useApiMutation from "hooks/use-api-mutations";
import { AttendanceProps } from "modules/attendances/types";

const useCreateDisplacement = () => {
  const onSuccess = () => {
    router.back();
  };

  return useApiMutation({
    method: "POST",
    url: "/jobs/displacement",
    errorTitle: "Erro ao criar deslocamento",
    successTitle: "Deslocamento",
    successMessage: "Deslocamento criado com sucesso!",
    onSuccess,
  });
};

export default useCreateDisplacement;
