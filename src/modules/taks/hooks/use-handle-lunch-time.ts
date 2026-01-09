import { router } from "expo-router";
import { DriverStatus } from "modules/work-journey/types";
import { useCallback, useMemo } from "react";
import useSkipLuncthTimeUntil from "../storage/use-skip-lunch-time-until";
import dateFnsHelpers from "util/date-fns-helpers";
import { addHours } from "date-fns";
import notifee, { TimestampTrigger, TriggerType } from "@notifee/react-native";
import useProfileStorage from "modules/users/storage/use-profile-storage";

interface ScheduleNotificationProps {
  id: string;
  title: string;
  body: string;
}

const useHandleLunchTime = () => {
  const { profile } = useProfileStorage();

  const { skipLunchTimeUntil, setSkipLunchTimeUntil } =
    useSkipLuncthTimeUntil();

  const registrationDate = useMemo(
    () => profile?.currentWorkJourney?.registrationDate,
    [profile]
  );

  const canScheduleNotification = useCallback(
    async (hours: number, notification: ScheduleNotificationProps) => {
      if (!registrationDate) return;

      const notificationDate = dateFnsHelpers.addMinutes(
        registrationDate,
        60 * hours
      );

      if (dateFnsHelpers.isAfter(new Date(), notificationDate)) return;

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: notificationDate.getTime(),
      };

      await notifee.createTriggerNotification(
        {
          ...notification,
          android: {
            channelId: "important",
          },
        },
        trigger
      );
    },
    [registrationDate]
  );

  const scheduleNotifications = useCallback(async () => {
    await canScheduleNotification(4.5, {
      id: "LUNCH_TIME_FIRST_NOTIFICATION",
      title: "Parada para alimentação pendente",
      body: "Você deve fazer uma pausa para alimentação em 1 hora e 30 minutos",
    });

    await canScheduleNotification(5, {
      id: "LUNCH_TIME_SECOND_NOTIFICATION",
      title: "Parada para alimentação pendente",
      body: "Você deve fazer uma pausa para alimentação em 1 hora",
    });

    await canScheduleNotification(5.5, {
      id: "LUNCH_TIME_THIRD_NOTIFICATION",
      title: "Parada para alimentação pendente",
      body: "Você deve fazer uma pausa para alimentação em 30 minutos",
    });

    const ids = await notifee.getTriggerNotificationIds();
  }, [canScheduleNotification]);

  const resolve = useCallback(async () => {
    setSkipLunchTimeUntil(null);
    await notifee.cancelTriggerNotifications([
      "LUNCH_TIME_FIRST_NOTIFICATION",
      "LUNCH_TIME_SECOND_NOTIFICATION",
      "LUNCH_TIME_THIRD_NOTIFICATION",
    ]);

    if (!profile) return false;

    if (skipLunchTimeUntil && dateFnsHelpers.isAfterNow(skipLunchTimeUntil))
      return false;

    const { requiredLunchStop, currentWorkJourney, pendingCampaign } = profile;

    if (
      !requiredLunchStop ||
      !currentWorkJourney ||
      currentWorkJourney.driverStatus === DriverStatus.STOPPED ||
      pendingCampaign
    )
      return false;

    if (currentWorkJourney.stopCounts?.lunch > 0) return false;

    await scheduleNotifications();

    if (
      !dateFnsHelpers.isAfter(
        new Date(),
        addHours(currentWorkJourney.registrationDate, 6)
      )
    )
      return false;

    router.push("/work-journey/lunch-time-needed");

    return true;
  }, [profile, scheduleNotifications]);

  return resolve;
};

export default useHandleLunchTime;
