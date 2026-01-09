import { router } from "expo-router";
import useProfileStorage from "modules/users/storage/use-profile-storage";
import { useCallback } from "react";
import dateFnsHelpers from "util/date-fns-helpers";

const useWorkJourneyStandardLimit = () => {
  const { profile } = useProfileStorage();

  const resolve = useCallback(() => {
    if (!profile) return false;

    const { companyConfigParameters, currentWorkJourney } = profile;

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
  }, [profile]);

  return resolve;
};

export default useWorkJourneyStandardLimit;
