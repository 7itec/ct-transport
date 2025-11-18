import { Mixpanel } from "mixpanel-react-native";
import { useCallback, useEffect } from "react";
import { nativeApplicationVersion } from "expo-application";
import useToken from "modules/authentication/storage/use-token";
import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";

type SendLog = (title: string, payload?: any) => void;
const mixpanel = new Mixpanel("d301ae4b3798841789a10e61ef1ff2da", true);

const useLogs = () => {
  const { token } = useToken();
  const { data } = useCurrentWorkJourney();

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
    (title: string, payload?: any) => {
      mixpanel.track(title, {
        ...payload,
        date: new Date().toISOString(),
        // currentWorkJourney,
        // isConnected,
        // driverId,
        // driverName,
        // tasks,
        // requests: requests.filter((request) => request.url !== '/alerts'),
        // alerts: requests.filter((request) => request.url === '/alerts'),
        // latitude,
        // longitude,
        // company: companyName,
      });
    },
    [
      // currentWorkJourney,
      // isConnected,
      // driverId,
      // driverName,
      // tasks,
      // requests,
      // latitude,
      // longitude,
    ]
  );

  return { trackEvent };
};

export default useLogs;
