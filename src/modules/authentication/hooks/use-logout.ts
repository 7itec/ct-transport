import useToken from "../storage/use-token";
import useSession from "../storage/use-session";
import useStorage from "hooks/use-storage";
import useStorageManager from "hooks/use-storage-manager";
import useCameraPermission from "modules/permissions/storage/use-camera-permission";
import useLocationPermission from "modules/permissions/storage/use-location-permission";
import useNotificationsPermission from "modules/permissions/storage/use-notifications-permission";
import storage from "util/storage";

const useLogout = () => {
  const { setToken } = useToken();
  const { endSession } = useSession();
  const { setStorage } = useStorageManager();
  const { cameraPermission } = useCameraPermission();
  const { locationPermission } = useLocationPermission();
  const { notificationsPermission } = useNotificationsPermission();
  const [serverConnection] = useStorage("serverConnection");

  return () => {
    endSession();
    setToken(null);
    storage.clearStore();
    setStorage({
      cameraPermission,
      locationPermission,
      notificationsPermission,
      serverConnection,
    });
  };
};

export default useLogout;
