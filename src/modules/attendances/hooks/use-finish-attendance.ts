import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import attendancesKeys from "../util/attendances-keys";
import { AttendanceProps, AttendanceStatusEnum } from "../types";
import { updateAttendanceStatus } from "../util/update-attendance-status";
import { router } from "expo-router";

const useFinishAttendance = (attendanceId: string) => {
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
      attendance!,
      AttendanceStatusEnum.Finished
    );

    router.dismiss(2);

    attendancesQuery.setData(
      attendances!.filter((someAttendance) =>
        someAttendance._id === attendanceId ? updatedAttendance : someAttendance
      )
    );
    attendanceQuery.setData(updatedAttendance!);
  };

  return useApiMutation({
    method: "PATCH",
    url: `/jobs/${attendanceId}/finished`,
    errorTitle: "Erro ao finalizar atendimento",
    onSuccess,
  });
};

export default useFinishAttendance;
