import { Alert } from "react-native";
import dateFnsHelpers from "util/date-fns-helpers";
import useCurrentWorkJourney from "./use-current-work-journey";
import useAttendances from "modules/attendances/hooks/use-attendances";
import { AttendanceStatusEnum } from "modules/attendances/types";
import { DriverStatus, WorkStopsEnum } from "../types";
import useValidateAlert from "modules/alerts/hooks/use-validate-alert";
import useIsWorkJourneyEndingAlert from "modules/alerts/hooks/use-is-work-journey-ending-alert";
import useEndWorkJourney from "./use-end-work-journey";
import generateId from "util/generate-id";
import useResumeStop from "./use-resume-stop";
import useStopAttendance from "modules/attendances/hooks/use-stop-attendance";
import useLogs from "hooks/use-logs";
import getGpsCoordinates from "modules/geolocation/hooks/get-gps-coordinates";

const useHandleEndWorkJourney = () => {
  const workJourneyEndingAlert = useIsWorkJourneyEndingAlert();

  const profileQuery = useCurrentWorkJourney();
  const attendancesQuery = useAttendances();

  const resumeStopMutation = useResumeStop();
  const endWorkJourneyMutation = useEndWorkJourney();
  const validateAlertMutation = useValidateAlert(workJourneyEndingAlert?._id!);
  const stopAttendanceMutation = useStopAttendance();
  const trackEvent = useLogs();

  const { currentWorkJourney, group } = profileQuery?.data ?? {};
  const attendances = attendancesQuery?.data;

  const handleEndWorkDay = async () => {
    const lunchTime = currentWorkJourney!.timing.stops.lunch.minutes;

    if (
      group?.name === "Motorista" &&
      dateFnsHelpers.differenceInHours(
        new Date(),
        new Date(currentWorkJourney!.registrationDate)
      ) >= 6 &&
      lunchTime < 30
    )
      return Alert.alert(
        "Encerrar jornada de trabalho",
        "Não é possivel encerrar a jornada de trabalho sem cumprir o horário mínimo de alimentação!"
      );

    if (lunchTime < 60)
      return Alert.alert(
        "Encerrar jornada de trabalho",
        `Você ainda tem ${
          60 - lunchTime
        } minutos do seu horário de alimentação a serem cumpridos, deseja realmente encerrar a jornada de trabalho?`,
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

    const { latitude, longitude } = await getGpsCoordinates();

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
