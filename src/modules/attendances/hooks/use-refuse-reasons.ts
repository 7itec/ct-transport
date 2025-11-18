import { AttendanceProps } from "modules/attendances/types";
import attendancesKeys from "modules/attendances/util/attendances-keys";
import useApiQuery from "shared/hooks/use-api-query";

export interface RefuseReasonProps {
  _id: string;
  name: string;
}

const useRefuseReaons = () => {
  return useApiQuery<RefuseReasonProps[]>({
    url: "/job-refused-reasons/all",
    queryKey: attendancesKeys.refuseReasons(),
    errorTitle: "Erro ao buscar motivos de recusa",
  });
};

export default useRefuseReaons;
