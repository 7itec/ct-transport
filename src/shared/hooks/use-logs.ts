import { Mixpanel } from "mixpanel-react-native";
import { useCallback, useEffect } from "react";
import { nativeApplicationVersion } from "expo-application";
import useToken from "modules/authentication/storage/use-token";
import useServerConnection from "modules/offline-processor/hooks/use-server-connection";
import useGps from "modules/geolocation/hooks/use-gps";
import useQueryStorage from "./use-query-storage";
import usersKeys from "modules/users/util/users-keys";
import { UserProps } from "modules/work-journey/types";

type SendLog = (title: string, payload?: any) => void;
const mixpanel = new Mixpanel("272e48a8d9a3def26505260c43483f24", true);

const useLogs = () => {
  const { token } = useToken();
  const isServerConnection = useServerConnection();
  const { data } = useQueryStorage<UserProps | undefined>(usersKeys.profile());
  const { latitude, longitude } = useGps();

  useEffect(() => {
    if (token) initLogs();
    else mixpanel.reset();
  }, [token]);

  const initLogs = async () => {
    await mixpanel.init();

    const distinctId = await mixpanel.getDistinctId();

    if (data && distinctId !== data?.driverId?.toString()) {
      mixpanel.identify(`${data?.driverId}`);
    }

    if (data) {
      mixpanel.getPeople().set("Name", data?.driverName);
      mixpanel.getPeople().set("Id", data?.driverId);
    }

    mixpanel.getPeople().set("AppVersion", nativeApplicationVersion);
  };

  const trackEvent: SendLog = useCallback(
    async (title: string, payload?: any) => {
      mixpanel.track(title, {
        ...payload,
        date: new Date().toISOString(),
        currentWorkJourney: data?.currentWorkJourney,
        isServerConnection,
        driverId: data?.driverId,
        driverName: data?.driverName,
        company: data?.companyName,
        latitude,
        longitude,
      });
    },
    [
      isServerConnection,
      data?.currentWorkJourney,
      data?.driverId,
      data?.driverName,
      data?.companyName,
    ]
  );

  return trackEvent;
};

export default useLogs;
