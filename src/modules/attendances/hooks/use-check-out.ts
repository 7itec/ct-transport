import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import attendancesKeys from "../util/attendances-keys";
import { AttendanceProps } from "../types";

const useCheckOut = (attendanceId: string, passengerId: string) => {
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

    attendancesQuery.setData(
      attendances.map((attendance) =>
        attendance._id === attendanceId
          ? {
              ...attendance,
              tripulation: (attendance as AttendanceProps).tripulation.map(
                (passenger) =>
                  passenger._id === passengerId
                    ? { ...passenger, status: "Finalizado" }
                    : passenger
              ),
            }
          : attendance
      )
    );

    attendanceQuery.setData({
      ...attendance,
      tripulation: (attendance as AttendanceProps).tripulation.map(
        (passenger) =>
          passenger._id === passengerId
            ? { ...passenger, status: "Finalizado" }
            : passenger
      ),
    });
  };

  return useApiMutation({
    method: "PATCH",
    url: `/jobs/${attendanceId}/check-out/passenger/${passengerId}`,
    errorTitle: "Erro ao realizar check-out",
    onSuccess,
  });
};

export default useCheckOut;
