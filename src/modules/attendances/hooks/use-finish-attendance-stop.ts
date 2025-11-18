import useApiMutation from "hooks/use-api-mutations";
import attendancesKeys from "../util/attendances-keys";
import useQueryHelpers from "hooks/use-query-helpers";
import { AttendanceProps } from "../types";
import { updateAttendanceStatus } from "../util/update-attendance-status";

const useFinishAttendanceStop = (attendanceId: string) => {
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

    const updatedAttendance = updateAttendanceStatus(attendance!);

    attendancesQuery.setData(
      attendances.map((someAttendance) =>
        someAttendance._id === attendanceId ? updatedAttendance : someAttendance
      )
    );
    attendanceQuery.setData(updatedAttendance);
  };

  return useApiMutation({
    method: "PATCH",
    url: `/jobs/${attendanceId}/resumed`,
    errorTitle: "Erro ao finalizar parada do atendimento",
    onSuccess,
  });
};

export default useFinishAttendanceStop;
