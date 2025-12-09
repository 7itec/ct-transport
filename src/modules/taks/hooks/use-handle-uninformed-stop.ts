import useAttendances from "modules/attendances/hooks/use-attendances";
import { AttendanceStatusEnum } from "modules/attendances/types";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import { DriverStatus } from "modules/work-journey/types";
import { useCallback, useRef } from "react";
import BackgroundGeolocation from "react-native-background-geolocation";
import useSkipUninformedStopUntil from "../storage/use-skip-uninformed-stop-until";
import dateFnsHelpers from "util/date-fns-helpers";
import { router } from "expo-router";

const useHandleUninformedStop = () => {
  const attendancesQuery = useAttendances();
  const { data } = useCurrentWorkJourney();
  const { skipUninformedStopUntil, setSkipUninformedStopUntil } =
    useSkipUninformedStopUntil();
  const timerRef = useRef<number | null>(null);

  const isDisplacement = attendancesQuery.data?.find(
    (attendance) =>
      AttendanceStatusEnum.Displacement === attendance.status ||
      AttendanceStatusEnum.Arrival === attendance.status ||
      AttendanceStatusEnum.InAttendance === attendance.status
  );

  const resolve = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!data) return false;

    const location = await BackgroundGeolocation.getCurrentPosition({
      samples: 1, // mais preciso
      persist: false,
    });

    const { currentWorkJourney } = data;
    const { is_moving: isMoving, coords } = location;

    if (!coords) return;

    if (
      coords.speed! > 0 ||
      isMoving ||
      !currentWorkJourney ||
      !currentWorkJourney.conductorVehicle ||
      currentWorkJourney.driverStatus === DriverStatus.STOPPED ||
      !isDisplacement
    )
      return false;

    if (!skipUninformedStopUntil) {
      setSkipUninformedStopUntil(dateFnsHelpers.addSeconds(new Date(), 30));
      return false;
    }

    if (!dateFnsHelpers.isAfter(new Date(), skipUninformedStopUntil))
      return false;

    router.push("/work-journey/uninformed-stop");

    return true;
  }, [
    attendancesQuery.data,
    data,
    skipUninformedStopUntil,
    setSkipUninformedStopUntil,
  ]);

  return resolve;
};

export default useHandleUninformedStop;
