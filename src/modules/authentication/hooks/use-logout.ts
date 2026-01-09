import useToken from "../storage/use-token";
import useSession from "../storage/use-session";
import useCameraPermission from "modules/permissions/storage/use-camera-permission";
import useLocationPermission from "modules/permissions/storage/use-location-permission";
import useNotificationsPermission from "modules/permissions/storage/use-notifications-permission";
import storage from "util/storage";
import useLogs from "hooks/use-logs";

const useLogout = () => {
  const { setToken } = useToken();
  const { endSession } = useSession();
  const { cameraPermission, setCameraPermission } = useCameraPermission();
  const { locationPermission, setLocationPermission } = useLocationPermission();
  const { notificationsPermission, setNotificationsPermission } =
    useNotificationsPermission();
  const trackEvent = useLogs();

  return async () => {
    const keys = await storage.indexer.getKeys();

    const keysToRemove = keys.filter(
      (key) =>
        ![
          "cameraPermission",
          "locationPermission",
          "notificationsPermission",
          "arrayIndex",
          "stringIndex",
          "boolIndex",
          "mapIndex",
          "default",
        ].includes(key)
    );

    setToken(null);
    storage.removeItems(keysToRemove);

    trackEvent("Logout");
    endSession();
  };
};

export default useLogout;
