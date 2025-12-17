import { Mixpanel } from "mixpanel-react-native";
import { useCallback, useEffect } from "react";
import { nativeApplicationVersion } from "expo-application";
import useToken from "modules/authentication/storage/use-token";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import useServerConnection from "modules/offline-processor/hooks/use-server-connection";
import getGpsCoordinates from "modules/geolocation/hooks/get-gps-coordinates";

type SendLog = (title: string, payload?: any) => void;
const mixpanel = new Mixpanel("272e48a8d9a3def26505260c43483f24", true);

const useLogs = () => {
  const { token } = useToken();
  const { data } = useCurrentWorkJourney();
  const isServerConnection = useServerConnection();

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
      const { latitude, longitude } = await getGpsCoordinates();

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
