import {
  AttendanceProps,
  AttendanceStatusEnum,
} from "modules/attendances/types";
import { DriverStatus } from "modules/work-journey/types";
import { useCallback, useRef } from "react";
import BackgroundGeolocation from "react-native-background-geolocation";
import useSkipUninformedStopUntil from "../storage/use-skip-uninformed-stop-until";
import dateFnsHelpers from "util/date-fns-helpers";
import { router } from "expo-router";
import useProfileStorage from "modules/users/storage/use-profile-storage";
import useStorage from "hooks/use-storage";
import attendancesKeys from "modules/attendances/util/attendances-keys";

const useHandleUninformedStop = () => {
  const [attendances] = useStorage<AttendanceProps[]>(attendancesKeys.list());
  const { profile } = useProfileStorage();
  const { skipUninformedStopUntil, setSkipUninformedStopUntil } =
    useSkipUninformedStopUntil();
  const timerRef = useRef<number | null>(null);

  const isDisplacement = attendances?.find(
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

    if (!profile) return false;

    const location = await BackgroundGeolocation.getCurrentPosition({
      samples: 1, // mais preciso
      persist: false,
    });

    const { currentWorkJourney } = profile;
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
    attendances,
    profile,
    skipUninformedStopUntil,
    setSkipUninformedStopUntil,
  ]);

  return resolve;
};

export default useHandleUninformedStop;
