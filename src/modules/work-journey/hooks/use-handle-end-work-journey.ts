import { Alert } from "react-native";
import dateFnsHelpers from "util/date-fns-helpers";
import {
  AttendanceProps,
  AttendanceStatusEnum,
} from "modules/attendances/types";
import { DriverStatus, WorkStopsEnum } from "../types";
import useValidateAlert from "modules/alerts/hooks/use-validate-alert";
import useIsWorkJourneyEndingAlert from "modules/alerts/hooks/use-is-work-journey-ending-alert";
import useEndWorkJourney from "./use-end-work-journey";
import generateId from "util/generate-id";
import useResumeStop from "./use-resume-stop";
import useStopAttendance from "modules/attendances/hooks/use-stop-attendance";
import useLogs from "hooks/use-logs";
import useGps from "modules/geolocation/hooks/use-gps";
import useProfileStorage from "modules/users/storage/use-profile-storage";
import useStorage from "hooks/use-storage";
import attendancesKeys from "modules/attendances/util/attendances-keys";

const useHandleEndWorkJourney = () => {
  const workJourneyEndingAlert = useIsWorkJourneyEndingAlert();

  const { profile } = useProfileStorage();
  const [attendances] = useStorage<AttendanceProps[]>(attendancesKeys.list());

  const resumeStopMutation = useResumeStop();
  const endWorkJourneyMutation = useEndWorkJourney();
  const validateAlertMutation = useValidateAlert(workJourneyEndingAlert?._id!);
  const stopAttendanceMutation = useStopAttendance();
  const trackEvent = useLogs();
  const { latitude, longitude } = useGps();

  const { currentWorkJourney, group } = profile ?? {};
  const handleEndWorkDay = async () => {
    const lunchTime = currentWorkJourney!.timing.stops.lunch.minutes;
    const isDriver = group?.name === "Motorista";

    if (
      isDriver &&
      dateFnsHelpers.differenceInHours(
        new Date(),
        new Date(currentWorkJourney!.registrationDate)
      ) >= 6 &&
      lunchTime < 55
    )
      return Alert.alert(
        "Encerrar jornada de trabalho",
        "Não é possivel encerrar a jornada de trabalho sem cumprir o horário mínimo de alimentação!"
      );

    Alert.alert(
      "Encerrar jornada de trabalho",
      "Deseja realmente encerrar a jornada de trabalho?",
      [
        {
          text: "cancelar",
        },
        {
          text: "encerrar",
          onPress: finishJourney,
        },
      ]
    );
  };

  const finishJourney = async () => {
    const isAttendance = attendances?.find((attendance) =>
      [
        AttendanceStatusEnum.Arrival,
        AttendanceStatusEnum.Displacement,
        AttendanceStatusEnum.InAttendance,
      ].includes(attendance.status)
    );

    if (isAttendance)
      await stopAttendanceMutation.mutate({
        latitude,
        longitude,
        attendanceId: isAttendance._id,
        stopReason: "Jornada encerrada",
        workStopId: WorkStopsEnum.endWorkJourney,
        registrationDate: new Date(),
      });

    const isStopped = currentWorkJourney?.driverStatus === DriverStatus.STOPPED;

    if (isStopped)
      await resumeStopMutation.mutate({
        latitude,
        longitude,
        workStopId: currentWorkJourney.lastWorkRecord.payload.workStopId,
        registrationDate: new Date(),
      });

    trackEvent("End Work Journey");

    await endWorkJourneyMutation.mutate({
      latitude,
      longitude,
      registrationDate: new Date(),
      workRecordId: generateId(),
    });

    if (workJourneyEndingAlert) validateAlertMutation.mutate();
  };

  return {
    handleEndWorkDay,
    finishJourney,
    isLoading:
      resumeStopMutation.isLoading ||
      endWorkJourneyMutation.isLoading ||
      validateAlertMutation.isLoading ||
      stopAttendanceMutation.isLoading,
  };
};

export default useHandleEndWorkJourney;
