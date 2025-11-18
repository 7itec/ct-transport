import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import attendancesKeys from "../util/attendances-keys";
import { AttendanceProps, AttendanceStatusEnum } from "../types";
import { updateAttendanceStatus } from "../util/update-attendance-status";
import { router } from "expo-router";

const useRefuseAttendance = (attendanceId: string) => {
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
      AttendanceStatusEnum.Rejected
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
    url: `/jobs/${attendanceId}/refused`,
    errorTitle: "Erro ao recusar atendimento",
    onSuccess,
  });
};

export default useRefuseAttendance;
