import useApiQuery from "hooks/use-api-query";
import { WorkRecordProps } from "../types";

const useWorkRecord = (workRecordId: string) => {
  return useApiQuery<WorkRecordProps>({
    url: `/work-records/${workRecordId}`,
    errorTitle: "Erro ao buscar detalhes do registro de trabalho",
  });
};

export default useWorkRecord;
