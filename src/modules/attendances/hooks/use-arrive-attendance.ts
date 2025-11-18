import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import attendancesKeys from "../util/attendances-keys";
import { AttendanceProps, AttendanceStatusEnum } from "../types";
import { updateAttendanceStatus } from "../util/update-attendance-status";

const useArriveAttendance = (attendanceId: string) => {
  const attendancesQuery = useQueryHelpers<AttendanceProps[]>(
    attendancesKeys.list()
  );
  const attendanceQuery = useQueryHelpers<AttendanceProps>(
    attendancesKeys.details(attendanceId)
  );

  const onSuccess = () => {
    const attendances = attendancesQuery.data;
    const attendance = attendanceQuery.data;

    if (!attendances || !attendance) return;

    const updatedAttendance = updateAttendanceStatus(
      attendance,
      AttendanceStatusEnum.Arrival
    );

    attendancesQuery.setData(
      attendances.map((someAttendance) =>
        someAttendance._id === attendanceId ? updatedAttendance : someAttendance
      )
    );
    attendanceQuery.setData(updatedAttendance);
  };

  return useApiMutation({
    method: "PATCH",
    url: `/jobs/${attendanceId}/arrival`,
    errorTitle: "Erro ao colocar atendimento em chegada",
    onSuccess,
  });
};

export default useArriveAttendance;
