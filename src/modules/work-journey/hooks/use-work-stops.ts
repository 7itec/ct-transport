import useApiQuery from "hooks/use-api-query";
import { WorkStopProps } from "../types";

const useWorkStops = () => {
  return useApiQuery<WorkStopProps[]>({
    url: "/work-stops/me",
    errorTitle: "Erro ao buscar paradas",
  });
};

export default useWorkStops;
