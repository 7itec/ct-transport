import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import attendancesKeys from "../util/attendances-keys";
import { AttendanceProps, AttendanceStatusEnum } from "../types";
import { updateAttendanceStatus } from "../util/update-attendance-status";
import { router } from "expo-router";

const useStopAttendance = (attendanceId: string) => {
  const attendancesQuery = useQueryHelpers<AttendanceProps[]>(
    attendancesKeys.list()
  );
  const attendanceQuery = useQueryHelpers<AttendanceProps>(
    attendancesKeys.details(attendanceId)
  );

  const onSuccess = (data: any, { attendanceId }: { attendanceId: string }) => {
    const attendances = attendancesQuery.data;
    const attendance = attendanceQuery.data;

    if (!attendances || !attendance) return;

    const updatedAttendance = updateAttendanceStatus(
      attendance!,
      AttendanceStatusEnum.Stopped
    );

    attendancesQuery.setData(
      attendances.map((someAttendance) =>
        someAttendance._id === attendanceId ? updatedAttendance : someAttendance
      )
    );
    attendanceQuery.setData(updatedAttendance);

    router.back();
  };

  return useApiMutation({
    method: "PATCH",
    url: (data) => `/jobs/${data?.attendanceId}/stopped`,
    errorTitle: "Erro ao parar atendimento",
    onSuccess,
  });
};

export default useStopAttendance;
