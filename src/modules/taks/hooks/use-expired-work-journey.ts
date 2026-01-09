import { router } from "expo-router";
import useProfileStorage from "modules/users/storage/use-profile-storage";
import { useCallback } from "react";
import dateFnsHelpers from "util/date-fns-helpers";

const useExpiredWorkJourney = () => {
  const { profile } = useProfileStorage();

  const resolve = useCallback(() => {
    if (!profile?.currentWorkJourney) return;

    if (
      dateFnsHelpers.differenceInMinutesFromNow(
        profile.currentWorkJourney.registrationDate
      ) -
        (profile.currentWorkJourney.totalStopTimeInMinutes ?? 0) <=
      profile.companyConfigParameters.maxWorkJourneyTime.minutes
    )
      return false;

    return true;
  }, [profile]);

  return resolve;
};

export default useExpiredWorkJourney;
