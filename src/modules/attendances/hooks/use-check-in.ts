import useApiMutation from "hooks/use-api-mutations";
import useQueryHelpers from "hooks/use-query-helpers";
import attendancesKeys from "../util/attendances-keys";
import { AttendanceProps } from "../types";

const useCheckIn = (attendanceId: string, passengerId?: string) => {
  const attendancesQuery = useQueryHelpers<AttendanceProps[]>(
    attendancesKeys.list()
  );
  const attendanceQuery = useQueryHelpers<AttendanceProps>(
    attendancesKeys.details(attendanceId)
  );

  const onSuccess = (response: any, request: any) => {
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
                  passenger._id === (passengerId ?? request?.passengerId)
                    ? { ...passenger, status: "Deslocamento" }
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
          passenger._id === (passengerId ?? request?.passengerId)
            ? { ...passenger, status: "Deslocamento" }
            : passenger
      ),
    });
  };

  return useApiMutation({
    method: "PATCH",
    url: (data) =>
      `/jobs/${attendanceId}/check-in/passenger/${
        passengerId ?? data.passengerId
      }`,
    errorTitle: "Erro ao realizar check-in",
    onSuccess,
    successTitle: "Check-in",
    successMessage: "Check-in realizado com sucesso",
  });
};

export default useCheckIn;
