import { AttendanceProps, AttendanceStatusEnum } from "../types";

export const updateAttendanceStatus = (
  attendance: AttendanceProps,
  status?: AttendanceStatusEnum
): AttendanceProps => {
  const previousStatus = attendance?.previousStatus;
  if (status)
    attendance = { ...attendance, previousStatus: attendance?.status };
  attendance.status = status ?? previousStatus;

  return attendance;
};
