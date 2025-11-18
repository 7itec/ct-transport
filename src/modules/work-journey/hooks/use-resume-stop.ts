import useApiMutation from "hooks/use-api-mutations";
import { DriverStatus, UserProps, WorkStopsEnum } from "../types";
import useQueryHelpers from "hooks/use-query-helpers";
import dateFnsHelpers from "util/date-fns-helpers";
import usersKeys from "modules/users/util/users-keys";

const useResumeStop = () => {
  const { data: profile, setData } = useQueryHelpers<UserProps>(
    usersKeys.profile()
  );

  const onSuccess = () => {
    if (!profile?.currentWorkJourney) return;

    const { currentWorkJourney } = profile;

    if (currentWorkJourney?.timing.interjourney?.overtime)
      currentWorkJourney.timing.interjourney.overtime.compensated.seconds =
        (currentWorkJourney.timing.interjourney.overtime.compensated.seconds ??
          0) +
        dateFnsHelpers.differenceInSecondsFromNow(
          new Date(currentWorkJourney.lastWorkRecord.registrationDate)
        );
    if (currentWorkJourney.lastWorkRecord?.payload?.displacement) {
      currentWorkJourney.displacement = {
        date: new Date(),
      };
    }
    if (
      currentWorkJourney.lastWorkRecord?.payload?.workStopId ===
      WorkStopsEnum.meal
    ) {
      const lunchStops = currentWorkJourney.stopCounts.lunch;
      const lunchTime = currentWorkJourney.timing.stops.lunch.minutes;

      currentWorkJourney.stopCounts.lunch = lunchStops + 1;
      currentWorkJourney.timing.stops.lunch.minutes =
        lunchTime +
        dateFnsHelpers.differenceInMinutesFromNow(
          currentWorkJourney.lastWorkRecord.registrationDate
        );
      currentWorkJourney.lastWorkRecord.payload.workStopId = undefined;
    }
    currentWorkJourney.driverStatus = DriverStatus.IDLE;
    currentWorkJourney.totalStopTimeInMinutes =
      currentWorkJourney.totalStopTimeInMinutes +
      dateFnsHelpers.differenceInMinutesFromNow(
        currentWorkJourney.lastWorkRecord.registrationDate
      );

    setData({ ...profile, currentWorkJourney });
  };

  return useApiMutation({
    method: "POST",
    url: "/work-records/resumed-stop",
    errorTitle: "Erro ao finalizar parada",
    onSuccess,
  });
};

export default useResumeStop;
