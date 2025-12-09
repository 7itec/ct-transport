import { router } from "expo-router";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import { useCallback } from "react";
import dateFnsHelpers from "util/date-fns-helpers";

const useExpiredWorkJourney = () => {
  const { data } = useCurrentWorkJourney();

  const resolve = useCallback(() => {
    if (!data?.currentWorkJourney) return;

    if (
      dateFnsHelpers.differenceInMinutesFromNow(
        data.currentWorkJourney.registrationDate
      ) -
        (data.currentWorkJourney.totalStopTimeInMinutes ?? 0) <=
      data.companyConfigParameters.maxWorkJourneyTime.minutes
    )
      return false;

    return true;
  }, [data]);

  return resolve;
};

export default useExpiredWorkJourney;
