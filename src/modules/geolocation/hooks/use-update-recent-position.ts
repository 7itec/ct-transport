import useCurrentWorkJourney from "modules/work-journey/hooks/use-current-work-journey";
import { useEffect, useRef, useCallback } from "react";
import BackgroundGeolocation, {
  Location as RNBGLocation,
} from "react-native-background-geolocation";
import useApi from "hooks/use-api";
import dateFnsHelpers from "util/date-fns-helpers";

const useUpdateRecentPosition = () => {
  const { data } = useCurrentWorkJourney();
  const api = useApi(
    "https://cicm-api-recent-positions-f7btdehuaehvbbd3.eastus-01.azurewebsites.net"
  );

  const UPDATE_INTERVAL_MS = 30_000;
  const lastSentAtRef = useRef<number>(0);
  const mounted = useRef(false);

  const isRequesting = useRef(false);

  const handleLocation = useCallback(
    async (location: RNBGLocation) => {
      const now = Date.now();
      if (now - lastSentAtRef.current < UPDATE_INTERVAL_MS) return;
      if (!data?.currentWorkJourney?.conductorVehicle?._id) return;
      if (isRequesting.current) return;

      isRequesting.current = true;
      lastSentAtRef.current = now;

      try {
        await api({
          method: "PATCH",
          url: `/vehicles/${data.currentWorkJourney.conductorVehicle._id}/recent-position`,
          data: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            speed: location.coords.speed,
            heading: location.coords.heading,
            registrationDate: new Date(),
          },
        });
      } finally {
        isRequesting.current = false;
      }
    },
    [data?.currentWorkJourney?.conductorVehicle?._id]
  );

  useEffect(() => {
    mounted.current = true;

    const configure = async () => {
      await BackgroundGeolocation.ready({
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        locationUpdateInterval: 30000,
        fastestLocationUpdateInterval: 15000,
        preventSuspend: true,
        stopOnTerminate: false,
        startOnBoot: true,
        debug: false,
        foregroundService: true,
        notification: {
          title: "Monitorando sua jornada",
          text: "A localização está sendo atualizada em segundo plano.",
          channelName: "location-tracking",
          smallIcon: "mipmap/ic_launcher",
          priority: BackgroundGeolocation.NOTIFICATION_PRIORITY_HIGH,
        },
      });

      if (!mounted) return;

      BackgroundGeolocation.stopWatchPosition();

      await BackgroundGeolocation.start();

      BackgroundGeolocation.watchPosition(
        handleLocation,
        (e) => console.warn("[BGGeo] watchPosition error", e),
        {
          interval: 1000 * 30,
          persist: true,
          extras: { reason: "vehicle_tracking" },
        }
      );
    };

    configure();

    return () => {
      mounted.current = false;
      BackgroundGeolocation.stopWatchPosition();
    };
  }, [handleLocation, data?.currentWorkJourney?.conductorVehicle?._id]);
};

export default useUpdateRecentPosition;
