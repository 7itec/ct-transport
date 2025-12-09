import { useCallback } from "react";
import useHandleLunchTime from "./use-handle-lunch-time";
import useHandleUninformedStop from "./use-handle-uninformed-stop";
import useWorkJourneyStandardLimit from "./use-work-journey-standard-limit";
import dateFnsHelpers from "util/date-fns-helpers";
import useExpiredWorkJourney from "./use-expired-work-journey";

const useTaksManagement = () => {
  const handleLunchTime = useHandleLunchTime();
  const handleUninformedStop = useHandleUninformedStop();
  const handleWorkJourneyStandardLimit = useWorkJourneyStandardLimit();
  const handleExpiredWorkJourney = useExpiredWorkJourney();

  const handleTaksManagement = useCallback(async () => {
    console.log();
    console.log("handleTaks", dateFnsHelpers.defaultFormat(new Date()));

    const expiredWorkJourney = handleExpiredWorkJourney();

    console.log("expiredWorkJourney", expiredWorkJourney);

    if (expiredWorkJourney) return;

    const lunchTime = await handleLunchTime();

    console.log("handleLunchTime", lunchTime);

    if (lunchTime) return;

    const uninformedStop = await handleUninformedStop();

    console.log("handleUninformedStop", uninformedStop);

    if (uninformedStop) return;

    const workJourneyStandardLimit = handleWorkJourneyStandardLimit();

    console.log("handleWorkJourneyStandardLimit", workJourneyStandardLimit);

    if (workJourneyStandardLimit) return;
  }, [handleLunchTime, handleUninformedStop, handleWorkJourneyStandardLimit]);

  return handleTaksManagement;
};

export default useTaksManagement;
