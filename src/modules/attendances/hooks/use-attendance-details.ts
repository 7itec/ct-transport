import useApiQuery from "hooks/use-api-query";
import { AttendanceProps } from "../types";
import attendancesKeys from "../util/attendances-keys";

const useAttendanceDetails = (attendanceId: string) => {
  return useApiQuery<AttendanceProps>({
    url: `/jobs/${attendanceId}`,
    queryKey: attendancesKeys.details(attendanceId),
    errorTitle: "Erro ao buscar detalhes do atendimento",
  });
};

export default useAttendanceDetails;
