import useApiMutation from "hooks/use-api-mutations";
import formatChecklist from "../util/format-checklist";

const useAnswerChecklist = () => {
  return useApiMutation({
    method: "POST",
    url: "/checklists",
    formatData: formatChecklist,
    headers: { "Content-Type": "multipart/form-data" },
    errorTitle: "Erro ao enviar checklist",
  });
};

export default useAnswerChecklist;
