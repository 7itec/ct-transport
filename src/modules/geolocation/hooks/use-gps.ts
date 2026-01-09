import { useEffect } from "react";
import * as Location from "expo-location";
import useStorage from "hooks/use-storage";

const useGps = () => {
  const [location, setLocation] = useStorage("location", {
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    (async () => {
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000 * 15,
          distanceInterval: 15,
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return location ?? {};
};

export default useGps;
