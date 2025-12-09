import { router } from "expo-router";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import { useCallback } from "react";
import dateFnsHelpers from "util/date-fns-helpers";

const useWorkJourneyStandardLimit = () => {
  const { data } = useCurrentWorkJourney();

  const resolve = useCallback(() => {
    if (!data) return false;

    const { companyConfigParameters, currentWorkJourney } = data;

    if (!currentWorkJourney || currentWorkJourney.hasLimitReachedAlert)
      return false;

    if (
      dateFnsHelpers.isAfter(
        dateFnsHelpers.addHours(
          currentWorkJourney.registrationDate,
          companyConfigParameters.standardWorkJourneyTime.hours
        ),
        new Date()
      )
    )
      return false;

    router.push("/work-journey/standard-limit");

    return true;
  }, [data]);

  return resolve;
};

export default useWorkJourneyStandardLimit;
